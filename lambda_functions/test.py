import requests 
import pandas 

BASE_URL = "https://7kng2w0ibk.execute-api.us-east-2.amazonaws.com/development"

def test_workflow():
    newJob = requests.post(BASE_URL).json()
    print("New job response ", newJob)
    return newJob
    job= newJob['job'] 
    print(job)
    uploadDetails = newJob["destination_upload_url"]
    
    files = {'file': open('dests.csv','rb')}

    r = requests.post(uploadDetails['url'], files=files,data = uploadDetails['fields'])
    if(not r.status_code == 204):
        print("Failed to upload dest file")
        return "Failed to upload dest file"

    run_job_response =requests.post(f'{BASE_URL}/{job["id"]}/run')
    print(run_job_response)
    return run_job_response

result = test_workflow()
