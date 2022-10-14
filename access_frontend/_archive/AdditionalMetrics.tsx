// import React  from "react";
// import {
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   FormControl, Typography,
//   FormLabel,
//   Grid,
//   Button,
//   RadioGroup,
//   Radio,
// } from "@mui/material";
// import { Section } from "../../Section";

// import { Job, PopulationSource } from "../../Job";

// interface AdditionalMetricsStepProps{
//   job: Job,
//   onUpdate: (update: Partial<Job>) => void;
//   onNextStep: () => void;
// }

// export const AdditionalMetricsStep: React.FC<AdditionalMetricsStepProps> = ({
//   onUpdate,
//   onNextStep,
//   job
// }) => {
//   return (
//     <Section
//       title={"Metrics"}
//       imageUrl={"calculate_pic.png"}
//     >
//         <Grid container direction="column" spacing={3}>
//           <Grid item>
//             <Typography variant='body1'>
//               We will automatically calculate the following metrics
//               <ul>
//                 <li>Number of destinations within the threshold travel timne from each origin</li>
//                 <li>Nearest destinations to each origin</li>
//               </ul>
//               In addition we can also calculate gravity model or access model values 
//             </Typography>
//           </Grid>
//           <Grid item>
//           <FormGroup>
//               <FormLabel id="travel-mode-label">
//                 What additional metrics do you want to calculate? 
//               </FormLabel>
//               <FormControlLabel control={<Checkbox value={job.includeGravityModel} onChange={(e,value)=> onUpdate({includeGravityModel: value})} />} label="Gravity Model "/>
//               <FormControlLabel control={<Checkbox value={job.includeAccessModel} onChange={(e,value)=> onUpdate({includeAccessModel: value})} />} label="Access Model"/>
//           </FormGroup>
//           </Grid>
//           <Grid item>
//           </Grid>
//           {(job.includeAccessModel || job.includeGravityModel) &&
//             <>
//             <Grid item>

//               <Typography variant='body1'>
//                 To calculate a gravity or access model we need some measure of the population at each origin.
//                 You can upload your own datafile with a custom population or choose ot use values from the US Census
//               </Typography>
//             </Grid>
//             <Grid item>    
//               <FormControl fullWidth>
//                 <FormLabel id="travel-mode-label">
//                   Population source  
//                 </FormLabel>
//                 <RadioGroup
//                   aria-labelledby="travel-mode-label"
//                   value={job.populationSource}
//                   name="input-tille-type"
//                   onChange={(e,value)=> onUpdate({populationSource: value as PopulationSource })}
//                 >
//                   <FormControlLabel
//                     value="census"
//                     control={<Radio />}
//                     label="Census"
//                   />
//                   <FormControlLabel
//                     value="custom"
//                     control={<Radio />}
//                     label={"Your own data"}
//                   />
//                 </RadioGroup>
//                 {job.populationSource==='custom' &&
//                   <Typography variant='body2'>You will be asked to upload this file at the end of the process</Typography>
//                 }

//                 <FormControlLabel control={<Checkbox value={job.useCapacity} onChange={(e,value)=> onUpdate({useCapacity: value})} />} label="Do you have a capacity value for each destination "/>
//                 <FormControlLabel control={<Checkbox value={job.useCategory} onChange={(e,value)=> onUpdate({useCategory: value})} />} label="Should we group destinations by category? "/>
//                 <FormControlLabel control={<Checkbox value={job.useWeights} onChange={(e,value)=> onUpdate({useWeights: value})} />} label="Would you like to weight each destinaton by a given amount? "/>
//               </FormControl>
//             </Grid>
//             </>
//           }
//           <Grid item>
//             <Button onClick={()=>onNextStep()} variant={"contained"}>Next</Button>
//           </Grid>
//         </Grid>
//     </Section>
//   );
// };
