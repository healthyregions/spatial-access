import React from "react";
import {
  Typography,
} from "@mui/material";
import { Job } from "../../Types/Job";
import { SectionComponentSpec } from "../../App";
import {JobRunner} from "../Layout/JobRunner";
import {validateJob} from "../../Hooks/useJobRunner";

const JobRunnerSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  resetJob,
  job,
}) => {

  return (
    <>
      <JobRunner resetJob={resetJob} job={job} destinationFile={job.destinationFile} populationFile={job.populationFile} />
    </>
  );
};

const JobRunnerSectionDescription: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <Typography variant="body1">
      Select files for the job
    </Typography>
  );
};

const canProgress = (_job: Job) => true;
const shouldShow = (job: Job, step: number) =>validateJob(job)

const prompt = (_job: Job) => `Upload required files and run job`;
const tooltip = (_job: Job) =>
  "Upload the files and link the columns in those files to various parameters";

const JobRunnerSection= {
  component: JobRunnerSectionComponent,
  additionalDescription: JobRunnerSectionDescription,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
  name:"JobRunnerSection"
};

export default JobRunnerSection;
