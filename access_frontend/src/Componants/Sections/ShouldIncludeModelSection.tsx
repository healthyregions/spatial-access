
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
        <FormControlLabel value={true} control={<Radio />} label={`Yes, calculate an access score for ${TextDictionary[job.geom]}s near my destinations.`} />
        <FormControlLabel value={false} control={<Radio />} label={`No, calculate only the time to the nearest destination and number of destinations for ${TextDictionary[job.geom]}s near my destinations.`} />
      </RadioGroup>
    </FormControl>
  );
};

const ShouldIncludeModelSectionDescription: React.FC<{job: Job}> = ({job}) => {
    return (
        <Typography variant='body1'>
               We will automatically calculate the following metrics
               <ul>
                 <li>Number of destinations within the threshold travel timne from each origin</li>
                 <li>Nearest destinations to each origin</li>
               </ul>
               In addition we can also calculate gravity model or access model values 
             </Typography>
    )
}

const canProgress = (job: Job) => true;
const shouldShow = (job: Job, step: number) => step > 0;
const prompt = (job: Job) => `Do you want to calculate an access score?`;
const tooltip = (job: Job) => "An access score is an single score that represents availability of service or access based on distance, population (demand), and available capacity (supply) if data is provided.";

const ShouldIncludeModelSection = {
    component: ShouldIncludeModelSectionComponent,
    additionalDescription: ShouldIncludeModelSectionDescription,
    canProgress,
    shouldShow,
    prompt,
    tooltip,
};

export default ShouldIncludeModelSection;