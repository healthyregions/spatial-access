import boto3 
import json
from botocore.exceptions import ClientError
import os
from access_logging import logger

BUCKET = os.environ["ACCESS_BUCKET"]
PATH   = os.environ["ACCESS_PATH"]
s3 = boto3.resource('s3')
s3Client= boto3.client('s3')

def load_job(job_id):
    job_folder =f"{PATH}/{job_id}" 
    job_file = f"{job_folder}/job.json"
    job_object = s3.Object(BUCKET,job_file).get()
    job = job_object['Body'].read().decode('utf-8')
    return json.loads(job)

def save_job(job):
    job_id = job["id"]
    job_folder =f"{PATH}/{job_id}" 
    job_file = f"{job_folder}/job.json"

    s3.Object(BUCKET,job_file).put(Body=bytes(json.dumps(job).encode('UTF-8')))

def save_result(result,job):

    job_id = job["id"]
    job_folder =f"{PATH}/{job_id}" 
    result_file = f"{job_folder}/result.csv"
    resultObject = s3.Object(BUCKET,result_file)
    resultObject.put(Body=bytes(result.to_csv().encode('UTF-8'))) 
    return create_presigned_get_url(BUCKET,result_file,expiration=86400)

def check_for_destination_file(job):
    job_id =job["id"] 
    job_folder =f"{PATH}/{job_id}" 
    destination_file= f"{job_folder}/destinations.csv"
    logger.info(f"Checking for destination file at {destination_file}")

    # try:
    result = s3.Object(BUCKET,destination_file)
    try: 
        result.load()
        return True
    except:
        return False

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
        print("ERROR ",e)
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
        response = s3_client.generate_presigned_post(Bucket= bucket_name,
                                                     Key = object_name,
                                                     ExpiresIn=expiration)
    except ClientError as e:
        print("ERROR ",e)
        logging.error(e)
        return None

    print(response)
    # The response contains the presigned URL
    return response
