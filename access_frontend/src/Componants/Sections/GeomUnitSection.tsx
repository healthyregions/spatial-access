import React from "react";
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Geom, Job } from "../../Types/Job";
import { SectionComponentSpec } from "../../App";


// meta
const canProgress = (_job: Job) => true;
const shouldShow = (_job: Job, _step: number) => true;
const prompt = (_job: Job) => "What scale of analysis do you want?";
const tooltip = (_job: Job) => "Census tracts and zip codes join to different data.";

// component
const GeomUnitSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { geom } = job;
  return (
    <FormGroup>
      <FormControl fullWidth>
        <InputLabel id="travel-mode-label">Target Geometry</InputLabel>
        <Select
          labelId="travel-mode-label"
          id="tarvel-mode"
          value={geom}
          label="Target Geometry"
          onChange={(e) => {
            onUpdate({
              geom: e.target.value as Geom,
            });
          }}
        >
          <MenuItem value={"tract"}>Census Tracts</MenuItem>
          <MenuItem value={"zip"}>Zip Codes</MenuItem>
        </Select>
      </FormControl>
    </FormGroup>
  );
};

const GeomUnitSection = {
  component: GeomUnitSectionComponent,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
};

export default GeomUnitSection;
