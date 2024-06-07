import { Button, Typography } from "@mui/material";
import React from "react";
import { Job } from "../../Types/Job";
import { useJobRunner } from "../../Hooks/useJobRunner";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface JobRunnerProps {
  job: Job;
  destinationFile?: File;
  populationFile?: File;
  resetJob: ()=>void
}

export const JobRunner: React.FC<JobRunnerProps> = ({ job,resetJob}) => {
  const { result, error, run, status, isValid } = useJobRunner(job);
  if(error) console.log("error is ", error);
  return (
    <>
      {status === "pending" && (
        <div style={{display:'flex', flexDirection:"column", gap:"10px"}}>
        <Button disabled={!isValid} onClick={() => run()} variant={"contained"}>
          Submit Job
        </Button>
        <Button
          disabled={!isValid}
          onClick={() => resetJob()}
          variant={"contained"}
        >
          Start over
        </Button>
        </div>
      )}

      {error && <div style={{marginTop:"10px"}}>

        <Typography sx={{ color: "red" , marginTop:"10px" }}>Something went wrong: {error}</Typography>
        <Typography >Check your input files and some of your settings and try again</Typography>
        </div>
      }

      {status === "done" && result && (
        <div
          style={{ display: "flex", flexDirection : "column", gap : "20px" }}
        >
          <a
            href={result.result_url}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Button variant={"contained"}>Download Results</Button>
          </a>
          <Button
            disabled={!isValid}
            onClick={() => run()}
            variant={"contained"}
          >
            Run again
          </Button>
          <Button
            disabled={!isValid}
            onClick={() => resetJob()}
            variant={"contained"}
          >
            Start over
          </Button>
        </div>
      )}

      {status === "running" && (
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {status}
          <CircularProgress />
        </Box>
      )}
    </>
  );
};
