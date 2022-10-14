
import React from "react";
import {
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {TravelMode,Job} from '../../Types/Job'
import { SectionComponentSpec } from "../../App";

const TravelModeSectionComponent: React.FC<
  SectionComponentSpec
> = ({ onUpdate, job}) => {
  const {mode} = job;

  return (
      <FormGroup>
            <FormControl fullWidth>
              <InputLabel id="travel-mode-label">
                Travel Mode 
              </InputLabel>
              <Select
                labelId="travel-mode-label"
                id="tarvel-mode"
                value={mode}
                label="Travel Mode"
                onChange={(e) => {
                  onUpdate({
                    mode : e.target.value as TravelMode,
                  });
                }}
              >
                <MenuItem value={"walk"}>Walking</MenuItem>
                <MenuItem value={"car"}>Driving</MenuItem>
                <MenuItem value={"bike"}>Biking</MenuItem>
              </Select>
            </FormControl>
      </FormGroup>
  );
};

const canProgress = (_job: Job) => true;
const shouldShow = (_job: Job, _step: number) => true;
const prompt = (_job: Job) => "How does your community get around?";
const tooltip = (_job: Job) => "This determines the travel cost matrices used in the calculations.";

const TravelModeSection = {
    component: TravelModeSectionComponent,
    canProgress,
    shouldShow,
    prompt,
    tooltip,
};

export default TravelModeSection;