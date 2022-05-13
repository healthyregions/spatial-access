import { useState, useCallback } from "react";
import { CalculationSettings, JobParams, ODFileDetails } from "./types";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const awaitJobResolved = async (jobId: string) => {
  let result;

  while (true) {
    let resp = await fetch(`/checkJobStatus/${jobId}`);
    let status = await resp.json();

    console.log("Job Stats is ", status);
    if (status.job_status === "exception") {
      return Promise.reject(Error(status.exception_message));
    }
    
    if (status.job_status === "finished") {
      result = status;
      break;
    }
    await sleep(1000);
  }
  return result;
};


export const useJobRunner = (
  calcParams: CalculationSettings,
  originParams: ODFileDetails,
  destParams: ODFileDetails
) => {
  const [jobId, setJobId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [jobResultUrl, setJobResultUrl] = useState<string| null>(null);
  const [running, setRunning] = useState<boolean>(false);

  console.log("Job runner ", error, running, jobResultUrl, jobId )

  const run = useCallback(() => {
    setRunning(true)
    const jobParams: JobParams = {
      orders: {
        init_kwargs: {
          network_type: calcParams.travelMode,
          source_column_names: {
            lat: originParams.latitudeCol,
            lon: originParams.longitudeCol,
            idx: originParams.idCol,
            population: originParams.amountCol
          },
          dest_column_names: {
            lat: destParams.latitudeCol,
            lon: destParams.longitudeCol,
            idx: destParams.idCol,
            category: destParams.categoryCol,
            capacity: destParams.amountCol
          },
        },
        calculate_kwargs: {
          upper_threshold: calcParams.upperThreshold * 60,
          normalize:false,
        },
      },
      aggregate_kwargs: {},
      job_type: "model",
      model_type: "AccessModel",
      primary_resource: originParams.resourceId,
      secondary_resource: destParams.resourceId,
    };

    fetch("/submitJob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobParams),
    })
      .then((res) => res.json())
      .then((res) => {
        setError(null);
        setJobId(res.job_id);

        awaitJobResolved(res.job_id).then((outcome) => {
          setJobResultUrl(`/getResultsForJob/${res.job_id}`);
        })
        .catch((err)=>{
          setJobId(null);
          setError(err);
        })
        .finally(()=> setRunning(false));
      })
      .catch((err) => {
        setJobId(null);
        setError(err);
      });
  }, [calcParams, originParams, destParams]);

  return { result: jobResultUrl, jobId, run, error, running };
};
