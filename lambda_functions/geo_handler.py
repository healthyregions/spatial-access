try:
  import unzip_requirements
except ImportError:
  pass

import json
import pandas as pd 
import geopandas as gp 
from metrics import * 
from utils import load_job,save_job, save_result, s3, BUCKET, PATH
from access_logging import logger
import os
    
tracts = gpd.read_file(DEFAULT_GEOGRAPHIES['tract'])
zips = gpd.read_file(DEFAULT_GEOGRAPHIES['zip'])


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
        "body": "fired async", 
    }
    return response


def load_df_from_s3(object_name):
    s3object = s3.Object(BUCKET,object_name)
    return pd.read_csv(s3object.get()['Body'])


def process_job(event,context):

    filesUploaded = event['Records']
    fileKey = filesUploaded[0]["s3"]["object"]['key']

    logger.info(f"running for files {json.dumps(filesUploaded)}")

    jobId = fileKey.split("/")[1]
    job = load_job(jobId)
    logger.info(f"got job {job}")

    if(job['status']=='running'):
        try:
            logger.info("Starting to run job")

            logger.info("Fetching destination data")
            destFile = fileKey.replace("job.json", "destinations.csv")            
            logger.info(f"loading destination file from {destFile}" )
            destinations = load_df_from_s3(destFile)
            logger.info(f"got {destinations.shape[0]} destinations" )
            logger.info(f"Setting up access parser" )

            access_parser = AccessMetricParser(
                transit_mode=job['mode'],
                geo_unit=job["geom"],
                geographies= tracts if job['geom'] == 'tract' else zips,
                geo_join_col="GEOID" if job['geom'] == 'tract' else "zip",
                coerce_geoid=True
            )

            logger.info(f"assigning destination data" )
            #  load destination data
            access_parser.set_destination_data(
                df=destinations,
                lat_col=job["destLatCol"],
                lon_col=job["destLngCol"]
            )

            logger.info(f"Setting threshold" )
            access_parser.set_travel_threshold(job['threshold'])

            # merge data
            logger.info("Merging data")

            access_parser.merge_data()

            logger.info("Running metrics")
            # run metrics
            result = access_parser.run_all_metrics()

            logger.info("Saving result")

            result_url = save_result(result, job)
            logger.info(f"Saved result got url {result_url}")

            logger.info("Updating job")
            job['status'] = "done"
            job['result_url'] = result_url
            save_job(job)

            logger.info("All done")
            response = {
                "statusCode": 200,
                "body": "successfully generated results" 
            }
            return response
            # except:
            #     response = {
            #         "statusCode": 500,
            #         "body": "Something failed when processing file" 
            #     }
            #     return response
        except Exception as e:
            logger.error(f"Failed to run {e}")
            job['status'] = "failed"
            job['error_message'] = str(e)
            save_job(job)
            response = {
                "statusCode": 500,
                "body": "Job failed" 
            }
            return response
    else:
        response = {
            "statusCode": 200,
            "body": "Not ready to run" 
        }
        return response

# def calc_metrics(event,context):


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
