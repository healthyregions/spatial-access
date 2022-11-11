import { useState, useCallback, useEffect } from "react";
import {Job} from "../Types/Job";
import { CalculationSettings, JobParams, ODFileDetails } from "../Types/types";

const BASE_URL = "https://7kng2w0ibk.execute-api.us-east-2.amazonaws.com"


export const validateJob =(job:Job)=>{
  const {destinationFile, populationFile } = job
  let isValid = true 
  // Check to see if we have the right columns set in destinatons using points
  if( job.destinationFormat === 'point' && !(job.destLatCol && job.destLngCol)){
    isValid=false
  }

  // Check to see if we have the right columns set for admin 
  if( job.destinationFormat === 'admin' && !job.destAdminCol){
    isValid=false
  }


  // If we are using an acces model or gravity model 
  if(job.includeModelMetrics){
    // Check to see if we have a custom source that we also have a populationFile and a source population column selected 
    if(job.populationSource ==='custom' && !(job.sourcePopulationColumn && populationFile)){
      isValid=false
    }
  }

  return isValid && (job.destinationFile !== null  || job.destinationFile !== undefined)
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const awaitJobResolved = async (jobId: string) => {
  let result;

  while (true) {
    let resp = await fetch(`${BASE_URL}/jobs/${jobId}`);
    let job = await resp.json();

    console.log("Job Stats is ", job);
    if (job.status=== "failed") {
      return Promise.resolve(job);
    }
    
    if (job.status === "done") {
      return Promise.resolve(job)
    }

    await sleep(10000);
  }
};


const uploadFileToPresigned = async (file: File,urlDetails:{url: string, fields: Record<string,string>})=>{
  const formData  = new FormData();
  Object.entries(urlDetails.fields).forEach( ([key,val])=>{
    formData.append(key,val)
  }) 
  formData.append("file", file)

  return fetch(urlDetails.url, {method:'POST',body: formData})
}

export const useJobRunner = (
  job: Job,
) => {
  const [error, setError] = useState<Error | null>(null);
  const [jobResultUrl, setJobResultUrl] = useState<any| null>(null);
  const [status, setStatus] = useState<string>('pending')

  const isValid = validateJob(job)

  const run = useCallback(()=>{
    
    (async ()=>{
      setStatus("running")
      setError(null)
      const jobReply= await fetch(`${BASE_URL}/jobs`, {method:"POST", body:JSON.stringify(job)})
      const jobResponse = await jobReply.json()
      const jobId = jobResponse.job.id
      const {destination_upload_url, population_upload_url} = jobResponse
      await uploadFileToPresigned(job.destinationFile!, destination_upload_url)

      if((job.includeModelMetrics) && job.populationSource === "custom"){
        await uploadFileToPresigned(job.populationFile!, population_upload_url)
        await fetch(population_upload_url.url, {method:"POST", body:JSON.stringify(population_upload_url.fields)})
      }
      
      await fetch(`${BASE_URL}/jobs/${jobId}/run`, {method:"POST"})

      const result = await awaitJobResolved(jobResponse.job.id)
      if(result.status==='failed'){
        console.log("detected failure")
        setError(result.error_message)
        setStatus("pending")
      }
      else{
        setStatus('done')
        setJobResultUrl(result)
      }

    })()

  },[job])



  return { result: jobResultUrl,  error, status, run, isValid};
};
