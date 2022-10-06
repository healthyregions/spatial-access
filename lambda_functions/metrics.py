import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from dataclasses import dataclass
from typing import List, Union
from access import Access, weights, Datasets

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
        'car':'https://uchicago.box.com/shared/static/hkipez75z2p7zivtjdgsfzut4rhm6t6h.parquet',
        'bike':'https://uchicago.box.com/shared/static/cvkq3dytr6rswzrxlgzeejmieq3n5aal.parquet',
        'walk':'https://uchicago.box.com/shared/static/swggh8jxj59c7vpxzx1emt7jnd083rmh.parquet'
    },
    'zip': {
        'car':'https://uchicago.box.com/shared/static/swggh8jxj59c7vpxzx1emt7jnd083rmh.parquet',
        'bike':'https://uchicago.box.com/shared/static/7yzgf1gx3k3sacntjqber6l40m0d5aqw.parquet', 
        'walk':'https://uchicago.box.com/shared/static/b3vuqijqys24z146u78dsemn0wvu8i5m.parquet',  
    }
}

DEFAULT_GEOGRAPHIES = {
    'tract': 'https://uchicago.box.com/shared/static/kfoid6fzlbpyfecmwpe9u16cl5n89ru0.zip',
    'zip':'https://uchicago.box.com/shared/static/270ca6syxcg3dlvohhnt3ap92m4t7cxc.zip'
}

DEFAULT_GEOID_COLS = {
    "tract":"GEOID",
    "zip": "GEOID10"
}

DEFAULT_POP_DATA = {    
    'tract':'https://uchicago.box.com/shared/static/z6xm6tre935xbc06gg4ukzgyicro26cw.csv',
    'zip': 'https://uchicago.box.com/shared/static/njjpskiuj7amcztrxjws2jfwqlv66t49.csv'
}

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
            self.set_geographies(
                gpd.read_file(DEFAULT_GEOGRAPHIES[geo_unit]).to_crs('EPSG:4326'), 
                self.geo_join_col
            )
        if population_data is not None:
            self.set_population_data(
                population_data, 
                population_join_col, 
                population_data_col
            )
        else:
            default_pop_data = pd.read_csv(DEFAULT_POP_DATA[geo_unit])[[population_join_col, population_data_col]].iloc[1:]
            self.set_population_data(default_pop_data, 
                 population_join_col, 
                 population_data_col
            )

    def set_geographies(self, gdf: gpd.GeoDataFrame, geo_join_col: str) -> None:
        self.geographies = gdf
        self.geo_join_col = geo_join_col
        if (self.coerce_geoid == True):
            self.geographies[self.geo_join_col] = self.geographies[self.geo_join_col].astype('int64')
        self.valid_origins = list(self.geographies[self.geo_join_col].unique())

    def set_transit_matrix(self, pd: pd.DataFrame, matrix_join_col_o: str, matrix_join_col_d:str, matrix_travel_cost_col:str) -> None:
        self.transit_matrix = pd
        self.matrix_join_col_o = matrix_join_col_o
        self.matrix_join_col_d = matrix_join_col_d
        self.matrix_travel_cost_col = matrix_travel_cost_col

        if (self.coerce_geoid == True):
            self.transit_matrix[self.matrix_join_col_o] = self.transit_matrix[self.matrix_join_col_o].astype('int64')
            self.transit_matrix[self.matrix_join_col_d] = self.transit_matrix[self.matrix_join_col_d].astype('int64')
   
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
            gdf = gpd.sjoin(destinations, self.geographies[[self.geo_join_col, 'geometry']], how='inner', op='intersects')
            self.destinations = pd.DataFrame(gdf)
            self.destinations_geoid_col = self.geo_join_col

        self.destinations = self.destinations.reset_index().rename(columns={df.index.name:'_access_matrix_index'})
        if (self.coerce_geoid == True):
            self.destinations[self.destinations_geoid_col] = self.destinations[self.destinations_geoid_col].astype('int64')

    def set_population_data(
        self,
        df: pd.DataFrame,
        population_join_col:str,
        population_data_col:str
    ) -> None:
        if (self.coerce_geoid == True):
            df[population_join_col] = df[population_join_col].astype('int64')
        self.population_data = df[[population_join_col, population_data_col]]
        self.population_join_col = population_join_col
        self.population_data_col = population_data_col
        self.geographies = self.geographies.merge(
            self.population_data,
            how="left",
            left_on=self.geo_join_col,
            right_on=self.population_join_col
        )

    def set_travel_threshold(self, threshold: int) -> None:
        self.travel_threshold = threshold

    def merge_data(
        self
    ) -> pd.DataFrame:
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
    
    def run_all_metrics(self) -> pd.DataFrame:
        ttn = self.analyze_nearest()
        cwt = self.analyze_count_in_threshold()
        grav = self.analyze_gravity(initialize_access=True)

        return self.geographies \
            .merge(ttn, how="left", left_on=self.geo_join_col, right_on=self.matrix_join_col_o) \
            .merge(cwt, how="left", left_on=self.geo_join_col, right_on=self.matrix_join_col_o) \
            .merge(grav, how="left", left_on=self.geo_join_col, right_on=self.geo_join_col) \
            .drop(columns=[f"{self.matrix_join_col_o}_x", f"{self.matrix_join_col_o}_y"])
            

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
        logging.error(e)
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
        logging.error(e)
        return None

    # The response contains the presigned URL
    return response
