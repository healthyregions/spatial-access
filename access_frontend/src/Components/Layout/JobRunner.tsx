import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import {Job} from '../../Types/Job'
import { useJobRunner } from "../../Hooks/useJobRunner";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


interface JobRunnerProps {
  job: Job;
  destinationFile?: File;
  populationFile?: File;
}

export const JobRunner: React.FC<JobRunnerProps> = ({
  job,
}) => {

  const { result, error, run, status, isValid} = useJobRunner(job);
  console.log("error is ",error)
  return (
    <>
      {status ==='pending' &&
        <Button disabled={!isValid} onClick={()=>run()} variant={"contained"}>Submit Job</Button>
      }

      {error &&
        <Typography sx={{color:"red"}}>{error.message}</Typography>
      }

      {status === 'done' && result &&
        <Stack>
        <a href={result.result_url} style={{textDecoration:"none"}}>
          <Button variant={"contained"}>
            Download Results
          </Button>
          </a>
          <Button disabled={!isValid} onClick={()=>run()} variant={"contained"}>Run again</Button>
          <Button disabled={!isValid} onClick={()=>run()} variant={"contained"}>Start over</Button>
        </Stack>
      }

      {status === 'running' && 
        <Box sx={{'display':'flex', gap:"10px", alignItems:"center"}}>
          {status}
          <CircularProgress />
        </Box>
      }
    </>
  );
};
