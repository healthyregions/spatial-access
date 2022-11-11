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
import { DestinationFormat, Job } from "../../Types/Job";
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
    <Typography variant='body1'>
      In your dataset with resource destinations, each row should represent a different location. You can
      either provide a latitude and longitude column, or use a column with a{" "}
      {job.geom === "tract" ? "census tract id" : "zip code"}. <i>Tip:</i> Use the 10-digit id code for tracts,
      or 5-digit ZCTA code for zip codes.
    </Typography>
  );
};
const canProgress = (_job: Job) => true;
const shouldShow = (job: Job, step: number) =>
  (step > 1 && !job.includeModelMetrics) ||
  (step > 3 && job.includeModelMetrics);
const prompt = (_job: Job) => "What is the data format of your resource file?";
const tooltip = (_job: Job) =>
  "For point data, your latitude and longitude columns should be in the WGS84/EPSG:4326 projection.";

const DestinationInputFormatSection = {
  component: DestinationInputFormatSectionComponent,
  additionalDescription: AdditionalDescription,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
  name:"DestinationInputFormatSection"
};

export default DestinationInputFormatSection;
