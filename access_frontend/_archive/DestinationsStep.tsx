// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   FormControl,
//   FormLabel,
//   Select,
//   MenuItem,
//   Slider,
//   Grid,
//   Button,
//   RadioGroup,
//   Radio,
// } from "@mui/material";
// import { Section } from "../../Section";

// import { DestinationFormat, Geom, Job } from "../../Job";

// interface DestinationsStep {
//   job:Job
//   onUpdate: (update: Partial<Job>) => void;
//   onNextStep: () => void;
// }

// export const DestinationsStep: React.FC<DestinationsStep> = ({
//   onUpdate,
//   onNextStep,
//   job
// }) => {
//   return (
//     <Section
//       title={"How do you want to specify your destinations"}
//       imageUrl={"calculate_pic.png"}
//     >
//         <Grid container direction="column" spacing={3}>
//           <Grid item>
//             <Typography variant='body1'>
//                 We will ask you to upload a file which includes your destinations. This 
//                 can either be as a list of locations with a latitude or logitude or a list of 
//                 items with a {job.geom ==='tract' ? "census tract id" : "zip code"}.
//                 Which would you like to use
//               </Typography>
//           </Grid>
//           <Grid item>
//           <FormGroup>
//             <FormControl fullWidth>
//               <FormLabel id="travel-mode-label">
//                 Destination file type
//               </FormLabel>
//               <RadioGroup
//                 aria-labelledby="travel-mode-label"
//                 value={job.destinationFormat}
//                 name="input-tille-type"
//                 onChange={(e,value)=> onUpdate({destinationFormat: value as DestinationFormat})}
//               >
//                 <FormControlLabel
//                   value="point"
//                   control={<Radio />}
//                   label="Point"
//                 />
//                 <FormControlLabel
//                   value="admin"
//                   control={<Radio />}
//                   label={job.geom === "tract" ? "Census Tract" : "Zip Code"}
//                 />
//               </RadioGroup>
//             </FormControl>
//           </FormGroup>
//           </Grid>
//           <Grid item>
//             <Button onClick={()=>onNextStep()} variant={"contained"}>Next</Button>
//           </Grid>
//         </Grid>
//     </Section>
//   );
// };
