# helper functions for backend
import boto3
import os

def download_from_s3(s3_path, local_path):
    s3 = boto3.client('s3')
    bucket_name, key = s3_path.replace("s3://", "").split("/", 1)
    s3.download_file(bucket_name, key, local_path)
