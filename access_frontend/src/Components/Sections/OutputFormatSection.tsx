import React from "react";
import {
  FormGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Job, OutputFormat } from "../../Types/Job";
import { SectionComponentSpec } from "../../App";
import {validateJob} from "../../Hooks/useJobRunner";

// meta
const canProgress = (_job: Job) => true;
const shouldShow = (job: Job, _step: number) => validateJob(job);
const prompt = (_job: Job) => "What format do you want the outputs in?";
const tooltip = (_job: Job) =>
  "You can select between spatial formats like GeoJson and ShapeFile and non spatial like CSV.";

// component
const OutputFormatSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { outputFormat } = job;
  return (
    <FormGroup>
      <FormControl fullWidth>
        <FormLabel id="demo-radio-buttons-group-label">Output Format</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="GeoJson"
          name="radio-buttons-group"
          value={outputFormat}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onUpdate({ outputFormat: event.target.value as OutputFormat })
          }
        >
          <FormControlLabel
            value="GeoJson"
            control={<Radio />}
            label="GeoJson"
          />
          {
          // #15: disable the Shapefile export until the 'No Space' issue is resolved
          /* <FormControlLabel
            value="ShapeFile"
            control={<Radio />}
            label="Shapefile"
          /> */}
          <FormControlLabel value="CSV" control={<Radio />} label="CSV" />
        </RadioGroup>
      </FormControl>
    </FormGroup>
  );
};

const OutputFormatSection = {
  component: OutputFormatSectionComponent,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
  name: "OutputFormatSection",
};

export default OutputFormatSection;
