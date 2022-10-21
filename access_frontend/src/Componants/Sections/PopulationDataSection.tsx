import React from "react";
import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Job } from "../../Types/Job";
import { SectionComponentSpec } from "../../App";
import { PopulationSource } from "../../Types/Job";

const PopulationDataSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { populationSource } = job;

  return (
    <>
      <FormControl>
        <RadioGroup
          aria-label="Which population data do you want to use?"
          value={populationSource}
          name="population-data-source"
          onChange={(_e, val) => {
            onUpdate({ populationSource: val as PopulationSource });
          }}
        >
          <FormControlLabel
            value={"census"}
            control={<Radio />}
            label="US Census (Default)"
          />
          <FormControlLabel
            value={"custom"}
            control={<Radio />}
            label="My own data"
          />
        </RadioGroup>
      </FormControl>
      {populationSource === "custom" && (
        <Typography variant="body1">
          You will be asked to upload this file at the end of the process
        </Typography>
      )}
    </>
  );
};

const PopulationDataSectionDescription: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <Typography variant="body1">
      To calculate a gravity or access model we need some measure of the
      population at each origin. You can upload your own datafile with a custom
      population or choose ot use values from the US Census.
    </Typography>
  );
};

const canProgress = (_job: Job) => true;
const shouldShow = (job: Job, step: number) =>
  step > 1 && job.includeModelMetrics;
const prompt = (_job: Job) => `Which population data do you want to use?`;
const tooltip = (_job: Job) =>
  "Population will be used as a proxy for the demand for your destinations over space.";

const PopulationDataSection = {
  component: PopulationDataSectionComponent,
  additionalDescription: PopulationDataSectionDescription,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
  name:"PopulationDataSection"
};

export default PopulationDataSection;
