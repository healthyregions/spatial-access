try:
  import unzip_requirements
except ImportError:
  pass

import json
import pandas as pd 
import geopandas as gp 
from utils import * 
    
tracts = gpd.read_file(DEFAULT_GEOGRAPHIES['tract'])

def metrics_success(event,context):
    print("success")
    return "success"

def metrics_failure(event,context):
    print("failure")
    return "failure"

def metrics_async_test(event,context):
    print("testing")

    response = {
        "statusCode": 200,
        "body": "fired async" 
    }
    return response

def calc_metrics(event,context):
    il_otp_destinations = pd.read_csv("https://raw.githubusercontent.com/GeoDaCenter/opioid-policy-scan/master/data_raw/Opioid_Treatment_Directory_Geocoded.csv", encoding='latin-1').query("STATE == 'IL'")

    il_access_parser = AccessMetricParser(
        transit_mode="car",
        geo_unit="tract",
        geographies=tracts,
        geo_join_col="GEOID",
        coerce_geoid=True
    )

    #  load destination data
    il_access_parser.set_destination_data(
        df=il_otp_destinations,
        lat_col="Latitude",
        lon_col="Longitude"
    )

    # merge data
    il_access_parser.merge_data()

    # run metrics
    result = il_access_parser.run_all_metrics()

    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": result.head(20).to_json()
    }

    return response


def hello(event, context):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """
