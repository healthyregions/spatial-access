import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from dataclasses import dataclass
from typing import List, Union
from access import Access, weights, Datasets
from helper import download_from_s3
import boto3
import os

def dfToGdf(df, lon, lat, crs='EPSG:4326'):
  '''
    df: pandas dataframe
    lon: longitude column name
    lat: latitude column name
    crs: EPSG code or similar coordinate reference system
  '''
  return gpd.GeoDataFrame(
    df.drop([lon, lat], axis=1),
    crs=crs,
    geometry=[Point(xy) for xy in zip(df[lon], df[lat])])

DEFAULT_MATRICES = {
    'tract': {
        'car':'s3://spatial-access/system-files/US-matrix-TRACT-DRIVING.parquet',
        'bike':'s3://spatial-access/system-files/US-matrix-TRACT-BICYCLE.parquet',
        'walk':'s3://spatial-access/system-files/US-matrix-ZIP-DRIVING.parquet'
    },
    'zip': {
        'car':'s3://spatial-access/system-files/US-matrix-ZIP-DRIVING.parquet',
        'bike':'s3://spatial-access/system-files/US-matrix-ZIP-BICYCLE.parquet', 
        'walk':'s3://spatial-access/system-files/US-matrix-ZIP-WALKING.parquet',  
    }
}


DEFAULT_GEOGRAPHIES = {
    'tract': 's3://spatial-access/system-files/cb_2019_us_tract_500k.zip',
    'zip': 's3://spatial-access/system-files/cb_2018_us_zcta510_500k.zip'
}
DEFAULT_GEOID_COLS = {
    "tract":"GEOID",
    "zip": "GEOID10"
}
DEFAULT_POP_DATA = {    
    'tract':'s3://spatial-access/system-files/DEFAULT_POP_DATA_TRACT.csv',
    'zip': 's3://spatial-access/system-files/DEFAULT_POP_DATA_ZIP.csv'
}
BUCKET = os.environ["ACCESS_BUCKET"]
PATH   = os.environ["ACCESS_PATH"]

StrOrInt = Union[int, str]

@dataclass
class AccessMetricParser:
    geo_unit: str = "tract"
    transit_mode: str = "car"

    matrix_join_col_o: str = "origin"
    matrix_join_col_d: str = "destination"
    matrix_travel_cost_col: str = "minutes"
    transit_matrix: pd.DataFrame = pd.DataFrame()
    travel_threshold: int = 30
        
    population_data: pd.DataFrame = pd.DataFrame()
    population_join_col: str = ""
    population_data_col: str = ""

    coerce_geoid: bool = False
    geographies: gpd.GeoDataFrame = gpd.GeoDataFrame()
    valid_origins: List[StrOrInt] = None
    geo_join_col: str = DEFAULT_GEOID_COLS['tract']

    destinations: pd.DataFrame = pd.DataFrame()
    destinations_geoid_col: str = ""

    merged_data: pd.DataFrame = pd.DataFrame()
    access: Access = None

    def __init__(
        self, 
        geo_unit:str = "tract", 
        transit_mode: str = "car",
        geographies: gpd.GeoDataFrame = None,
        geo_join_col: str = None,
        matrix_join_col_o: str = None,
        matrix_join_col_d: str = None,
        matrix_travel_cost_col: str = None,
        transit_matrix: pd.DataFrame = None,
        coerce_geoid: bool = None,
        population_data: pd.DataFrame = None,
        population_join_col: str = "FIPS",
        population_data_col: str = "Total Population"
    ):
        self.geo_unit = geo_unit
        self.transit_mode = transit_mode
        if coerce_geoid is not None:
            self.coerce_geoid = coerce_geoid

        print(f"start initializing AccessMetricParser with {geo_unit} and {transit_mode} and {geographies.columns.tolist()}")
        if transit_matrix is not None:
            self.set_transit_matrix(
                transit_matrix,
                matrix_join_col_o,
                matrix_join_col_d,
                matrix_travel_cost_col
            )
        else:
            self.set_transit_matrix(
                pd.read_parquet(DEFAULT_MATRICES[self.geo_unit][self.transit_mode]),
                self.matrix_join_col_o,
                self.matrix_join_col_d,
                self.matrix_travel_cost_col
            )
        if geographies is not None:
            self.set_geographies(geographies, geo_join_col)
        else:
            s3_path = DEFAULT_GEOGRAPHIES[geo_unit]
            local_path = f'/tmp/{geo_unit}.zip'
            print(f"Downloading {s3_path} to {local_path}")
            download_from_s3(s3_path, local_path)
            with gpd.read_file(f'zip://{local_path}') as geo_data:
                geo_data = geo_data.to_crs('EPSG:4326')
            self.set_geographies(geo_data, geo_join_col)
            os.remove(local_path)
        if population_data is not None:
            self.set_population_data(population_data, population_join_col, population_data_col)
        else:
            print(f"loading population data from DEFAULT_POP_DATA for {geo_unit}")
            default_pop_data = pd.read_csv(DEFAULT_POP_DATA[geo_unit])[[population_join_col, population_data_col]].iloc[1:]
            print(f"The first five default_pop_data is {default_pop_data.head(5)}")
            self.set_population_data(default_pop_data, population_join_col, population_data_col)


    # this could be the trigger point of Failed to run 'ZIP'
    def set_geographies(self, gdf: gpd.GeoDataFrame, geo_join_col: str) -> None:
        self.geographies = gdf
        self.geo_join_col = geo_join_col
        print(f"set_geographies is called with {self.geographies.columns.tolist()} and {self.geo_join_col}, and {self.coerce_geoid}") # geo_join_col is ZIP if selected zip. coerce_geoi is true
        if (self.coerce_geoid == True):
            try:
                self.geographies[self.geo_join_col] = self.geographies[self.geo_join_col].astype('int64')
            except Exception as e: print(f" Error in self.geographies[self.geo_join_col] : {e} ")
        try:
            self.valid_origins = list(self.geographies[self.geo_join_col].unique())
        except Exception as e: print(f" Error in self.valid_origins : {e} ")

    def set_transit_matrix(self, pd: pd.DataFrame, matrix_join_col_o: str, matrix_join_col_d:str, matrix_travel_cost_col:str) -> None:
        self.transit_matrix = pd
        self.matrix_join_col_o = matrix_join_col_o
        self.matrix_join_col_d = matrix_join_col_d
        self.matrix_travel_cost_col = matrix_travel_cost_col

        if (self.coerce_geoid == True):
            self.transit_matrix[self.matrix_join_col_o] = self.transit_matrix[self.matrix_join_col_o].astype('int64')
            self.transit_matrix[self.matrix_join_col_d] = self.transit_matrix[self.matrix_join_col_d].astype('int64')
        # this function ran successfully under the 'Failed to run 'ZIP' error

    # Load only the matrices for states that we have in the dataset
    # def get_limited_transit_matrix(self):
    #     if(self.destinations == None):
    #         raise Exception("Set destination data first")
    #     if(self.geo_unit =='zip'):
    #         raise Exception("Not implemented for zip just yet")

    #     state_ids = self.destinations["_access_matrix_index"].astype(str).str[0:2].unique()
    #     base_dir = DEFAULT_MATRICES[self.geo_unit][self.metric] + "/destination_state_id="
    #     matrix = pd.concat([pd.read_parquet(f"{base_dir}{state_id}") for state_id in state_ids])
        
    #     self.set_transit_matrix(
    #         matrix,
    #         self.matrix_join_col_o,
    #         self.matrix_join_col_d,
    #         self.matrix_travel_cost_col
    #     )
    def set_destination_data(
        self, 
        df: pd.DataFrame, 
        lat_col: str, 
        lon_col: str, 
        geoid_col: str = None
    ) -> None:
        if geoid_col is not None:
            self.destinations = df
            self.destinations_geoid_col = geoid_col
        else:
            destinations = dfToGdf(df, lon_col, lat_col)
            print(f"in set_destination determining destinations with {destinations.head()}")
            gdf = gpd.sjoin(destinations, self.geographies[[self.geo_join_col, 'geometry']], how='inner', op='intersects')
            print(f"in set_destination, gdf is {gdf.head()}")
            # in set_destination, gdf is GEOID_left FIPS ... index_right GEOID_right
            self.destinations = pd.DataFrame(gdf)
            print(f"self.destinations is {self.destinations.columns}")
            self.destinations_geoid_col = self.geo_join_col
            print(f"self.destinations_geoid_col is {self.destinations_geoid_col}")

        print(f"current index name is: {self.destinations.index.name}") # None
        self.destinations = self.destinations.reset_index().rename(columns={df.index.name:'_access_matrix_index'})
        print(f"self.destinations is {self.destinations.head()}")
        if (self.coerce_geoid == True):
            self.destinations[self.destinations_geoid_col] = self.destinations[self.destinations_geoid_col].astype('int64')

    def set_population_data(
        self, 
        df: pd.DataFrame,#default_pop_data
        population_join_col:str,
        population_data_col:str
    ) -> None:
        print(f"setting population data with {population_join_col} and {population_data_col}") # FIPS and Total Population
        # self is AccessMetricParser(geo_unit='zip', transit_mode='car', matrix_join_col_o='origin', matrix_join_col_d='destination', matrix_travel_cost_col='minutes', transit_matrix=  origin  destination  minutes (DF)
        # population_join_col='', population_data_col='', coerce_geoid=True, geographies=Empty GeoDataFrame,  valid_origins=None, geo_join_col='GEOID', destinations=Empty DataFrame


        if (self.coerce_geoid == True):
            df[population_join_col] = df[population_join_col].astype('int64')
        self.population_data = df[[population_join_col, population_data_col]]
        self.population_join_col = population_join_col
        self.population_data_col = population_data_col
        
        # all of them above are empty
        print(f"before geographies.merge, self.geo_join_col is {self.geo_join_col},self.population_join_col is {self.population_join_col}, self.geographies is {self.geographies.columns.tolist()}, self.population_data is {self.population_data.columns.tolist()}")
        # self.geo_join_col is GEOID, self.geographies is Empty GeoDataFrame, self.population_data is FIPS Total Population

        # what is zcta510 column is zip?
        try:
            self.geographies = self.geographies.merge(
            self.population_data,
            how="left",
            left_on=self.geo_join_col, # based on this. self should have a GEOID (census contract) column or a ZIP (zip) column
            right_on=self.population_join_col
        )
        except Exception as e: print(f" Error in self.geographies.merge : {e} ") # 'zip' error is here
        print(f"now self.geographies is {self.geographies.head()}")

    def set_travel_threshold(self, threshold: int) -> None:
        self.travel_threshold = threshold

    def merge_data(
        self
    ) -> pd.DataFrame:
        print(f"merge_data method is called")
        # Error: Runtime exited with error: signal: killed
        # merged_data = self.transit_matrix \
        #     .merge(
        #         self.destinations,
        #         how="inner",
        #         left_on=self.matrix_join_col_d,
        #         right_on=self.destinations_geoid_col
        #      )

        # NOT WORK: Use Index for Joining, still Error: Runtime exited with error: signal: killed Runtime.ExitError
        # self.transit_matrix.set_index(self.matrix_join_col_d, inplace=True)
        # self.destinations.set_index(self.destinations_geoid_col, inplace=True)
        # merged_data = self.transit_matrix.merge(self.destinations, how="inner", left_index=True, right_index=True)

        # print(f"after self.transit_matrix.merge, merged_data is {merged_data.head()} with columns {merged_data.columns}")
        # merged_data = merged_data.sort_values(self.matrix_travel_cost_col, ascending=True)
        # print(f"after sort_values, merged_data is {merged_data.head()}")
        # merged_data[self.matrix_travel_cost_col] = merged_data[self.matrix_travel_cost_col].replace(-1000, 999)
        # print(f"after replace, merged_data is {merged_data.head()}")
        # self.merged_data = merged_data

        # to fix the run out of memory error, try chunking the merge
        # chunk_size = 15000
        # for i in range(0, len(self.transit_matrix), chunk_size):
        #     chunk_transit = self.transit_matrix.iloc[i:i + chunk_size]
        #     merged_chunk = chunk_transit.merge(
        #         self.destinations,
        #         how="inner",
        #         left_on=self.matrix_join_col_d,
        #         right_on=self.destinations_geoid_col
        #     )
        #     print(f"after merge, merged_chunk is {merged_chunk.head()} with columns {merged_chunk.columns}")
        #     # Index(['origin', 'destination', 'minutes', 'index', 'compa', 'NAICS','geometry', 'index_right', 'GEOID'],
            
            
        #     # tried to use 'minutes' first, then will replace it to matrix_travel_cost_col
        #     merged_chunk = merged_chunk.sort_values('minutes', ascending=True) # minutes
        #     print(f"after sort_values, merged_chunk is {merged_chunk.head()}")
            
        #     merged_chunk[self.matrix_travel_cost_col] = merged_chunk[self.matrix_travel_cost_col].replace(-1000, 999)
        #     print(f"after replace, merged_chunk is {merged_chunk.head()}")
            
        #     self.merged_data = pd.concat([self.merged_data, merged_chunk])
        #     print(f"after concat, self.merged_data is {self.merged_data.head()} and iteration {i}")
        merged_data = self.transit_matrix \
            .merge(
                self.destinations,
                how="inner",
                left_on=self.matrix_join_col_d,
                right_on=self.destinations_geoid_col
             )
        

        merged_data = merged_data.sort_values(self.matrix_travel_cost_col, ascending=True)
        merged_data[self.matrix_travel_cost_col] = merged_data[self.matrix_travel_cost_col].replace(-1000, 999)
        self.merged_data = merged_data
        return merged_data.head(20)

    def analyze_nearest(self) -> pd.DataFrame:
        time_to_nearest = self.merged_data[~self.merged_data[self.matrix_join_col_o].duplicated()][[self.matrix_join_col_o, self.matrix_travel_cost_col]]
        return time_to_nearest[time_to_nearest[self.matrix_join_col_o].isin(self.valid_origins)]

    def analyze_count_in_threshold(self) -> pd.DataFrame:
        count_within_threshold = self.merged_data[self.merged_data[self.matrix_travel_cost_col] < self.travel_threshold] \
          .groupby(self.matrix_join_col_o).count() \
          .reset_index()[[self.matrix_join_col_o, self.matrix_travel_cost_col]] \
          .rename(columns={self.matrix_travel_cost_col: f"count in {self.travel_threshold}"})
        return count_within_threshold[count_within_threshold[self.matrix_join_col_o].isin(self.valid_origins)]

    def initialize_access(self) -> Access:
        self.access = Access(
                      demand_df = self.geographies, 
                      demand_index = self.geo_join_col, 
                      demand_value = self.population_data_col,
                      supply_df    = self.destinations, 
                      supply_index = self.destinations_geoid_col,
                      cost_df      = self.transit_matrix, 
                      cost_origin  = self.matrix_join_col_o, 
                      cost_dest    = self.matrix_join_col_d,
                      cost_name    = self.matrix_travel_cost_col
                    )
        return self.access


    def analyze_raam(self,initialize_access=False) -> pd.DataFrame:
        if (initialize_access):
            self.initialize_access()
          
        if self.access is None:
            print('Error - initialize access with .initialize_access() or pass initialize_access=True to analyize_gravity')
            return None

        result = self.access.raam(tau=30)
        return result.reset_index()



    def analyze_2SFC(self, initialize_access=False) -> pd.DataFrame:
        if (initialize_access):
            self.initialize_access()
          
        if self.access is None:
            print('Error - initialize access with .initialize_access() or pass initialize_access=True to analyize_gravity')
            return None

        result = self.access.two_stage_fca(name="2sfca")
        return result.reset_index()
    
    def analyze_gravity(self, initialize_access=False) -> pd.DataFrame: 
        if (initialize_access):
            self.initialize_access()
          
        if self.access is None:
            print('Error - initialize access with .initialize_access() or pass initialize_access=True to analyize_gravity')
            return None
            
        gravity = weights.gravity(scale = 60, alpha = -1)
        gravity_result = self.access.weighted_catchment(name = "gravity", weight_fn = gravity)\
            .reset_index()
        
        return gravity_result
    
    def run_all_metrics(self, withModel=None) -> pd.DataFrame:
        ttn = self.analyze_nearest()
        print(f"ttn is {ttn.head()}")
        cwt = self.analyze_count_in_threshold()
        print(f"cwt is {cwt.head()}")
        modelResult = pd.DataFrame()
        if withModel:
            if(withModel=='raam'):
                modelResult = self.analyze_raam(initialize_access=True)
            elif(withModel=='2fca'):
                modelResult = self.analyze_2SFC(initialize_access=True)
        print(f"modelResult is {modelResult.head()}")

        result =self.geographies \
            .merge(ttn, how="left", left_on=self.geo_join_col, right_on=self.matrix_join_col_o) \
            .merge(cwt, how="left", left_on=self.geo_join_col, right_on=self.matrix_join_col_o) 
        print(f"result is {result.head()}")
        if(withModel):
            print(f"modelResult is {modelResult.head()}")
            try:
                result = result.merge(modelResult, left_on=self.geo_join_col, right_on=self.matrix_join_col_o )
            except Exception as e: print(f" Error in result.merge : {e} ")

        return result.drop(columns=[f"{self.matrix_join_col_o}_x", f"{self.matrix_join_col_o}_y"])
            

def create_presigned_get_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to share an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('get_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        print(e)
        return None

    # The response contains the presigned URL
    return response

def create_presigned_put_url(bucket_name, object_name, expiration=3600):
    """Generate a presigned URL to upload to an S3 object

    :param bucket_name: string
    :param object_name: string
    :param expiration: Time in seconds for the presigned URL to remain valid
    :return: Presigned URL as string. If error, returns None.
    """

    # Generate a presigned URL for the S3 object
    s3_client = boto3.client('s3')
    try:
        response = s3_client.generate_presigned_url('put_object',
                                                    Params={'Bucket': bucket_name,
                                                            'Key': object_name},
                                                    ExpiresIn=expiration)
    except ClientError as e:
        print(e)
        return None

    # The response contains the presigned URL
    return response
