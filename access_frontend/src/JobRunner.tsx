import { Button, Typography } from "@mui/material";
import React from "react";
import { CalculationSettings, ODFileDetails } from "./types";
import { useJobRunner } from "./useJobRunner";

interface JobRunnerProps {
  calcParams: CalculationSettings;
  originParams: ODFileDetails;
  destParams: ODFileDetails;
}

export const JobRunner: React.FC<JobRunnerProps> = ({
  calcParams,
  originParams,
  destParams,
}) => {
  const { result, run, jobId, error, running } = useJobRunner(
    calcParams,
    originParams,
    destParams
  );

  console.log("error is ",error)

  return (
    <>
      <Button
        disabled={running}
        onClick={(e) => {
          run();
        }}
        fullWidth
        variant="contained"
      >
        {running ? "Running" : "Run calculation please"}
      </Button>
      {error &&
        <Typography sx={{color:"red"}}>{error.message}</Typography>
      }
      {result &&
        <a href={result}>Download Results</a>
      }
    </>
  );
};
