import boto3 
from botocore.exceptions import ClientError
from uuid import uuid4
from utils import * 
import json
import os
from access_logging import logger

BUCKET = os.environ["ACCESS_BUCKET"]
PATH   = os.environ["ACCESS_PATH"]
s3 = boto3.resource('s3') # this s3 is not called here, can be removed


def create_job(event,context):

    body = json.loads(event['body'])
    logger.info(json.dumps(body))

    mode= body['mode'] if 'mode' in body else 'walk'
    geom= body['geom'] if 'geom' in body else 'tract'
    threshold= body['threshold'] if 'threshold' in body else 30
    includeModelMetrics= body['includeModelMetrics'] if 'includeModelMetrics' in body else False
    modelType = body['modelType'] if 'modelType' in body else False
    populationSource= body['populationSource'] if "populationSource" in body else "census"
    sourcePopulationColumn= body['sourcePopulationColumn'] if "sourcePopulationColumn" in body else None
    sourceIdColumn= body['sourceIdColumn'] if "sourceIdColumn" in body else None
    destLatCol= body['destLatCol'] if "destLatCol" in body else "Latitude"
    destLngCol= body['destLngCol'] if "destLngCol" in body else "Longitude"
    destAdminCol= body['admin'] if "admin" in body else None
    useCapacity= body['useCapacity'] if "useCapacity" in body else False 
    destinationFormat = body['destinationFormat'] if "destinationFormat" in body else "point" 
    useWeights= body['useWeights'] if "useWeights" in body else "point" 
    useCategory= body['useCategory'] if "useCategory" in body else "point" 
    weights = body["weights"] if "weights" in body else "weights"

    categoryColumn = body['categoryColumn'] if "categoryColumn" in body else None
    capacityColumn= body['capacityColumn'] if "capacityColumn" in body else None
    outputFormat = body['outputFormat'] if 'outputFormat' in body else "GeoJSON"

    job_id  = uuid4()

    job = {
        "mode": mode,
        "geom": geom,
        "threshold": threshold,
        "includeModelMetrics": includeModelMetrics,
        "modelType": modelType,
        "populationSource":  populationSource,
        "sourcePopulationColumn": sourcePopulationColumn,
        "sourceIdColumn": sourceIdColumn,
        "destLatCol": destLatCol,
        "destLngCol": destLngCol,
        "destAdminCol": destAdminCol,
        "destinationFormat ": destinationFormat,
        "useWeights":useWeights,
        "useCategory":useCategory,
        "useCapacity": useCapacity,
        "categoryColumn ": categoryColumn,
        "capacityColumn": capacityColumn,
        "weights": weights,
        "outputFormat": outputFormat,
        "status":"pending",
        "id": str(job_id)
    }

    job_folder =f"{PATH}/{job_id}" 
    job_file = f"{job_folder}/job.json"

    destination_upload_url = create_presigned_put_url(BUCKET,f"{job_folder}/destinations.csv")  
    population_upload_url  = create_presigned_put_url(BUCKET,f"{job_folder}/population.csv")  

    save_job(job)
    
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "job" : job, 
            "destination_upload_url": destination_upload_url,
            "population_upload_url" : population_upload_url,
        })
    }

    return response 

def run_job(event,context):
    job_id = event["pathParameters"]['job_id']
    logger.info("In run_job function")
    job = load_job(job_id)
    logger.info(f"Running job with id {job_id}")

    if (check_for_destination_file(job)):
        job["status"] = "running"
        save_job(job)
        return {
            "statusCode":"201",
            "body" : json.dumps(job) 
        }
    else:
        return {
            "statusCode":"500",
            "body" : "Could not find destination file, upload before starting to run"
        }


# The error is seems to be the continuation of calling this function.
def get_job(event,context):
    job_id = event["pathParameters"]['job_id']
    logger.info(f"Getting job {job_id}")
    try:
        job = load_job(job_id)
        response ={
            'statusCode' : 200,
            "body" : json.dumps(job)
        }
        
        return response
    except:
        response={
            'statusCode':400,
            "body":"Failed to find job"
        }
        return response

