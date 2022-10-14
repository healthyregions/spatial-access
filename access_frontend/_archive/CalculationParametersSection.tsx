// import React, {useState, useEffect} from "react";
// import {
//   Box,
//   Typography,
//   FormGroup,
//   FormControlLabel,
//   Checkbox,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Slider,
//   Grid,
//   Button,
// } from "@mui/material";
// import { Section } from "../../Section";

// import {Geom,TravelMode,Job} from '../../Job'

// interface CalculationParametersSectionProps {
//   mode: TravelMode,
//   geom: Geom,
//   threshold:number,
//   onUpdate: (update: Partial<Job>) => void;
//   onNextStep: () => void;
// }


// function formatTime(minutes: number){
//   return  minutes < 60 ? `${minutes}` : `${ Math.floor(minutes/60)}h ${minutes%60}m`
// }

// export const CalculationParametersSection: React.FC<
//   CalculationParametersSectionProps
// > = ({ onUpdate, mode, geom, threshold,onNextStep}) => {
  
//   return (
//     <Section
//       title={"The basics"}
//       imageUrl={"calculate_pic.png"}
//     >
//       <FormGroup>
//         <Grid container direction="column" spacing={3}>
//           <Grid item>
//             <FormControl fullWidth>
//               <InputLabel id="travel-mode-label">
//                 Travel Mode 
//               </InputLabel>
//               <Select
//                 labelId="travel-mode-label"
//                 id="tarvel-mode"
//                 value={mode}
//                 label="Travel Mode"
//                 onChange={(e) => {
//                   onUpdate({
//                     mode : e.target.value as TravelMode,
//                   });
//                 }}
//               >
//                 <MenuItem value={"walk"}>Walking</MenuItem>
//                 <MenuItem value={"car"}>Driving</MenuItem>
//                 <MenuItem value={"bike"}>Biking</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item>
//             <FormControl fullWidth>
//               <InputLabel id="travel-mode-label">
//                 Target Geometry 
//               </InputLabel>
//               <Select
//                 labelId="travel-mode-label"
//                 id="tarvel-mode"
//                 value={geom}
//                 label="Travel Mode"
//                 onChange={(e) => {
//                   onUpdate({
//                     geom: e.target.value as Geom,
//                   });
//                 }}
//               >
//                 <MenuItem value={"tract"}>Census Tracts</MenuItem>
//                 <MenuItem value={"zip"}>Zip Codes</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item>
//             <Typography gutterBottom>Max Travel Time (mins): {formatTime(threshold)}</Typography>

//             <Slider
//               aria-label="Min Travel Distance"
//               value={threshold}
//               valueLabelFormat={(minutes:number, index:number)=> formatTime(minutes) }
//               valueLabelDisplay="auto"
//               min={9}
//               max={90}
//               step={1}
//               onChange={(e, val) =>
//                 onUpdate({
//                   threshold:Array.isArray(val) ? val[0] : val,
//                 })
//               }
//             />
//           </Grid>
//           <Grid item>
//             <Box sx={{width:"100%",display:'flex',flexDirection:'row', justifyContents:'space-between'}}>
//               <Button onClick={onNextStep} variant={'contained'}>Next</Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </FormGroup>
//     </Section>
//   );
// };
