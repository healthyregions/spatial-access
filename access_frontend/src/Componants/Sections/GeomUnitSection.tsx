import React from "react";
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import { Geom, Job } from "../../Types/Job";
import { SectionComponentSpec } from "../../App";


// meta
const canProgress = (_job: Job) => true;
const shouldShow = (_job: Job, _step: number) => true;
const prompt = (_job: Job) => "What scale of analysis do you want?";
const tooltip = (_job: Job) => "Census tracts and zip codes join to different data. Census tract boundaries are from the 2010 Census. Zip code boundaries correspond to Census 2010 5-digit Zip Code Tabulation Areas.";

// component
const GeomUnitSectionComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { geom } = job;
  return (
    <FormGroup>
      <FormControl fullWidth>
        <InputLabel id="travel-mode-label">Target Area</InputLabel>
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

const GeomUnitSectionDescription: React.FC<{job: Job}> = ({job}) => {
    return (
        <Typography variant='body1'>
              The target area you select (either census tract or zip code) serves as the geographic scale of analysis. 
              We calculate access from the population-weighted center of each geographic area (origin), to the center 
              of the geographic area that contains each resource (destination). 
        </Typography>
    )
}

const GeomUnitSection = {
  component: GeomUnitSectionComponent,
  additionalDescription: GeomUnitSectionDescription,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
  name:"GeomUnitSection"
};

export default GeomUnitSection;
