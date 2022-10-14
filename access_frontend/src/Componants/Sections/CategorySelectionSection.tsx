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

const CategorySelectionSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { useCategory } = job;

  return (
    <>
      <FormControl>
        <RadioGroup
          aria-label="Do you have multiple categories of destinations you would like to separately calculate access for?"
          value={!!useCategory}
          name="INCLUDE-MODEL-METRICS"
          onChange={(_e, val) => {
            onUpdate({ useCategory: val === "true" });
          }}
        >
          <FormControlLabel
            value={true}
            control={<Radio />}
            label="Yes, I have different categories for my destinations."
          />
          <FormControlLabel
            value={false}
            control={<Radio />}
            label="No, consider all of my destinations in the same category."
          />
        </RadioGroup>
      </FormControl>
      {!!useCategory && (
        <Typography>
          <i>
            You will be asked to choose which column in your data indicates
            destination category at the end of this process
          </i>
        </Typography>
      )}
    </>
  );
};

const canProgress = (job: Job) => true;
const shouldShow = (job: Job, step: number) =>
  step > 2 && job.includeModelMetrics;
const prompt = (job: Job) =>
  "Do you have multiple categories of destinations you would like to separately calculate access for?";
const tooltip = (job: Job) =>
  "If you have different types of destinations, such as doctors offices and dentists, you can separate these locations and calculate separate or compound access scores.";

const CategorySelectionSection = {
  component: CategorySelectionSectionComponent,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
};

export default CategorySelectionSection;
