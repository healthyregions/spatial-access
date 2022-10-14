import React from "react";
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { DestinationFormat, Job } from "../../Job";
import { SectionComponentSpec } from "../../App";

const DestinationInputFormatSectionComponent: React.FC<
  SectionComponentSpec
> = ({ onUpdate, job }) => {
  const { destinationFormat } = job;

  return (
    <FormGroup>
      <FormControl>
        <RadioGroup
          aria-label="Which population data do you want to use?"
          value={destinationFormat}
          name="destinationFormat-data-source"
          onChange={(_e, val) => {
            onUpdate({ destinationFormat: val as DestinationFormat });
          }}
        >
          <FormControlLabel
            value={"point"}
            control={<Radio />}
            label="Latitude and Longitude Columns (Point Data)"
          />
          <FormControlLabel
            value={"admin"}
            control={<Radio />}
            label={
              job.geom === "tract"
                ? "Census Tract ID Column"
                : "Zip Code Column"
            }
          />
        </RadioGroup>
      </FormControl>
    </FormGroup>
  );
};

const AdditionalDescription: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <Typography>
      In your data with destinations, each row a different location. You can
      either provide a latitude and longitude column or use a column with a{" "}
      {job.geom === "tract" ? "census tract id" : "zip code"}.
    </Typography>
  );
};
const canProgress = (_job: Job) => true;
const shouldShow = (job: Job, step: number) =>
  (step > 1 && !job.includeModelMetrics) ||
  (step > 3 && job.includeModelMetrics);
const prompt = (_job: Job) => "What is the format of your destinations?";
const tooltip = (_job: Job) =>
  "For point data, your latitude and longitude columns should be in the WGS84/EPSG:4326 projection.";

const DestinationInputFormatSection = {
  component: DestinationInputFormatSectionComponent,
  additionalDescription: AdditionalDescription,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
};

export default DestinationInputFormatSection;
