import { Button, Typography } from "@mui/material";
import React from "react";
import {Job} from './Job'
import { useJobRunner } from "./useJobRunner";

interface JobRunnerProps {
  job: Job;
  destinationFile?: File;
  populationFile?: File;
}

export const JobRunner: React.FC<JobRunnerProps> = ({
  job,
  destinationFile,
  populationFile
}) => {

  const { result, error, run, status, isValid} = useJobRunner(job, destinationFile,populationFile);
  return (
    <>
      {status ==='pending' &&
        <Button disabled={!isValid} onClick={()=>run()} variant={"contained"}>Submit Job</Button>
      }
      {error &&
        <Typography sx={{color:"red"}}>{error.message}</Typography>
      }
      {status === 'done' && result &&
        <a href={result.result_url}>Download Results</a>
      }
      {!result && !error &&
        <Typography >{status}</Typography>
      }
    </>
  );
};
