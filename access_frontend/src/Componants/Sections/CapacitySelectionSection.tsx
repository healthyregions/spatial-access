import React from "react";
import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Job } from "../../Job";
import { SectionComponentSpec } from "../../App";

const CapacitySelectionSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { useCapacity } = job;

  return (
    <>
    <FormControl>
      <RadioGroup
        aria-label="Do you want to specify the capacity of each destination?"
        value={!!useCapacity}
        name="INCLUDE-MODEL-METRICS"
        onChange={(_e, val) => {
          onUpdate({ useCapacity: val === "true" });
        }}
      >
        <FormControlLabel
          value={true}
          control={<Radio />}
          label="Yes, I have data on the capacity of each destination."
        />
        <FormControlLabel
          value={false}
          control={<Radio />}
          label="No, assume each destination has equal capacity."
        />
      </RadioGroup>
    </FormControl>
      {!!useCapacity && (
        <Typography>
            <i>
          You will be asked to choose which column in your data indicates capacity at the end of this process
          </i>
        </Typography>
      )}
    </>
  );
};

const CapacitySelectionSectionDescription: React.FC<{ job: Job }> = ({
  job,
}) => {
  return (
    <Typography variant="body1">
      By default, we will assume that each location has an equal capacity to
      serve your community. If you have data on the capacity of each
      destination, like the number of hospital beds or staff members, this data
      can be used to more accurately model demand.
    </Typography>
  );
};

const canProgress = (job: Job) => true;
const shouldShow = (job: Job, step: number) =>
  step > 1 && job.includeModelMetrics;
const prompt = (job: Job) =>
  "Do you want to specify the capacity of each destination?";
const tooltip = (job: Job) =>
  "Providing data on the capacity of each destination may more accurately reflect the access score calculated.";

const CapacitySelectionSection = {
  component: CapacitySelectionSectionComponent,
  additionalDescription: CapacitySelectionSectionDescription,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
};

export default CapacitySelectionSection;
