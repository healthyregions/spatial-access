import boto3 
from botocore.exceptions import ClientError
from uuid import uuid4
from utils import * 
import json
import os
from access_logging import logger

BUCKET = os.environ["ACCESS_BUCKET"]
PATH   = os.environ["ACCESS_PATH"]
s3 = boto3.resource('s3')


def create_job(event,context):

    body = json.loads(event['body'])
    logger.info(json.dumps(body))

    mode= body['mode'] if 'mode' in body else 'walk'
    geom= body['geom'] if 'geom' in body else 'tract'
    threshold= body['threshold'] if 'threshold' in body else 30
    includeGravityModel= body['includeGravityModel'] if 'includeGravityModel' in body else False
    includeAccessModel= body['includeAccessModel'] if 'includeAccessModel' in body else False
    populationSource= body['populationSource'] if "populationSource" in body else "census"
    sourcePopulationColumn= body['sourcePopulationColumn'] if "sourcePopulationColumn" in body else None
    sourceIdColumn= body['sourceIdColumn'] if "sourceIdColumn" in body else None
    destIdCol= body['destIdCol'] if "destIdCol" in body else "id"
    destLatCol= body['destLatCol'] if "destLatCol " in body else "Latitude"
    destLngCol= body['destLngCol'] if "destLngCol" in body else "Longitude"
    destAdminCol= body['admin'] if "admin" in body else None
    destinationFormat = body['destinationFormat'] if "destinationFormat" in body else "point" 
    categoryColumn = body['categoryColumn'] if "categoryColumn" in body else None
    capacityColumn= body['capacityColumn'] if "capacityColumn" in body else None
    weightColumn= body['weightColumn'] if "weightColumn" in body else None

    job_id  = uuid4()

    job = {
        "mode": mode,
        "geom": geom,
        "threshold": threshold,
        "includeGravityModel": includeGravityModel,
        "includeAccessModel": includeAccessModel,
        "populationSource":  populationSource,
        "sourcePopulationColumn": sourcePopulationColumn,
        "sourceIdColumn": sourceIdColumn,
        "destIdCol": destIdCol,
        "destLatCol": destLatCol,
        "destLngCol": destLngCol,
        "destAdminCol": destAdminCol,
        "destinationFormat ": destinationFormat, 
        "categoryColumn ": categoryColumn,
        "capacityColumn": capacityColumn,
        "weightColumn": weightColumn,
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

