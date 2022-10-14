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

const WeightSelectionSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { useWeights } = job;

  return (
    <>
      <FormControl>
        <RadioGroup
          aria-label="Do you want to combine and weight your access score from different categories to a single index?"
          value={!!useWeights}
          name="weight-use-weights"
          onChange={(_e, val) => {
            onUpdate({ useWeights: val === "true" });
          }}
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Yes, I want to weight the access scores to my different categories of destinations."
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="No, weight each category equally."
          />
        </RadioGroup>
      </FormControl>
      {!!useWeights && (
        <Typography>
          <i>
            You will be asked to choose weights for your different categories
            at the end of this process
          </i>
        </Typography>
      )}
    </>
  );
};

const canProgress = (job: Job) => true;
const shouldShow = (job: Job, step: number) =>
  step > 3 && !!job.includeModelMetrics && !!job.useCategory;
const prompt = (job: Job) =>
  "Do you want to combine and weight your access score from different categories to a single index?";
const tooltip = (job: Job) =>
  "If you combine multiple into a single compound index, you can represent an ecosystem of destinations.";

const WeightSelectionSection = {
  component: WeightSelectionSectionComponent,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
};

export default WeightSelectionSection;
