import { useState, useCallback, useEffect } from "react";
import {Job} from "../Types/Job";
import { CalculationSettings, JobParams, ODFileDetails } from "../Types/types";

const BASE_URL = "https://7kng2w0ibk.execute-api.us-east-2.amazonaws.com"


const validateJob =(job:Job, destinationFile?:File, populationFile?:File)=>{
  let isValid = true 
  // Check to see if we have the right columns set in destinatons using points
  if( job.destinationFormat === 'point' && !(job.destLatCol && job.destLngCol)){
    console.log("Not valid because we expect point geometry to have a lat and long column ", job)
    isValid=false
  }

  // Check to see if we have the right columns set for admin 
  if( job.destinationFormat === 'admin' && !job.destAdminCol){
    console.log("Not valid because we specified that the input dests are at the admin level and no adminIdCol set")
    isValid=false
  }


  // If we are using an acces model or gravity model 
  if(job.includeModelMetrics){
    // Check to see if we have a custom source that we also have a populationFile and a source population column selected 
    if(job.populationSource ==='custom' && !(job.sourcePopulationColumn && populationFile)){
      console.log("Not valid because we have specified a custom population but have either not included a population column or there is no populationFile")
      isValid=false
    }
  }

  return isValid && destinationFile
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
      return Promise.reject(Error("job failed"));
    }
    
    if (job.status === "done") {
      result = job;
      return Promise.resolve(result)
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
  destinationFile?: File,
  populationFile?:File 
) => {
  const [error, setError] = useState<Error | null>(null);
  const [jobResultUrl, setJobResultUrl] = useState<any| null>(null);
  const [status, setStatus] = useState<string>('pending')

  const isValid = validateJob(job, destinationFile, populationFile)

  const run = useCallback(()=>{
    
    (async ()=>{
      const jobReply= await fetch(`${BASE_URL}/jobs`, {method:"POST", body:JSON.stringify(job)})
      const jobResponse = await jobReply.json()
      const jobId = jobResponse.job.id
      const {destination_upload_url, population_upload_url} = jobResponse
      await uploadFileToPresigned(destinationFile!, destination_upload_url)

      if((job.includeModelMetrics) && job.populationSource === "custom"){
        setStatus("Uploading Population File")
        await uploadFileToPresigned(populationFile!, population_upload_url)
        await fetch(population_upload_url.url, {method:"POST", body:JSON.stringify(population_upload_url.fields)})
      }
      
      setStatus("Running Job")
      await fetch(`${BASE_URL}/jobs/${jobId}/run`, {method:"POST"})

      const result = await awaitJobResolved(jobResponse.job.id)
      console.log("result is ",result)
      if(result.error){
        setError(result.error)
        setStatus("failed")
      }
      else{
        setStatus(result.status)
        setJobResultUrl(result)
      }

    })()

  },[job,destinationFile,populationFile])



  return { result: jobResultUrl,  error, status, run, isValid};
};
