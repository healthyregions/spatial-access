
import React from "react";
import {
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography
} from "@mui/material";
import {Job} from '../../Types/Job'
import { SectionComponentSpec } from "../../App";
import { TextDictionary } from "../../Util/TextDictionary";

const ShouldIncludeModelSectionComponent: React.FC<
  SectionComponentSpec
> = ({ onUpdate, job}) => {
  const {includeModelMetrics} = job;
  
  return (
    <FormControl>
      <RadioGroup
        aria-label="Do you want to calculate an access score?"
        value={includeModelMetrics}
        name="INCLUDE-MODEL-METRICS"
        onChange={(_e, val) => {
            onUpdate({includeModelMetrics: val === "true"});
        }}
      >
        <FormControlLabel value={true} control={<Radio />} label={`Yes, calculate an advanced metric for ${TextDictionary[job.geom]}s near my data.`} />
        <FormControlLabel value={false} control={<Radio />} label={`No, the basics are fine for ${TextDictionary[job.geom]}s near my data.`} />
      </RadioGroup>
    </FormControl>
  );
};

const ShouldIncludeModelSectionDescription: React.FC<{job: Job}> = ({job}) => {
    return (
        <Typography variant='body1'>
              We automatically calculate the following metrics by area (tract/zip):
               <ul>
                 <li>Travel time (in minutes) to nearest resource. </li>
                 <li>Count of resources within max travel time selected.</li>
               </ul>
              In addition, we can also calculate an advanced access metric based on a <b>gravity model</b>.
              Gravity models take into account demand for resources, including how interest in accessing a resources 
              diminishes the further away it is, as well as the capacity of providers. 


        </Typography>
    )
}

const canProgress = (job: Job) => true;
const shouldShow = (job: Job, step: number) => step > 0;
const prompt = (job: Job) => `Do you want to calculate an advanced access metric?`;
const tooltip = (job: Job) => "An access score is an single score that represents availability of service or access based on distance, population (demand), and available capacity (supply) if data is provided.";

const ShouldIncludeModelSection = {
    component: ShouldIncludeModelSectionComponent,
    additionalDescription: ShouldIncludeModelSectionDescription,
    canProgress,
    shouldShow,
    prompt,
    tooltip,
    name:"ShouldIncludeModelSection"
};

export default ShouldIncludeModelSection;
