import React, {useState, useEffect} from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Grid,
} from "@mui/material";
import { Section } from "./Section";

import { CalculationSettings } from "./types";

interface CalculationParametersSectionProps {
  onDone: (update: CalculationSettings) => void;
}


function formatTime(minutes: number){
  return  minutes < 60 ? `${minutes}` : `${ Math.floor(minutes/60)}h ${minutes%60}m`
}

export const CalculationParametersSection: React.FC<
  CalculationParametersSectionProps
> = ({ onDone }) => {
  
  const [params, setParams] = useState<Partial<CalculationSettings>>({ upperThreshold: 10, travelMode:"walk"})

  useEffect(()=>{
    if(Object.values(params).every(v=>v)){
      onDone(params as CalculationSettings)
    }
  },[params])

  return (
    <Section
      title={"What do you want to calculate"}
      imageUrl={"calculate_pic.png"}
    >
      <FormGroup>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={"Measures of Origins' Spatial Proximity to Destinations"}
              checked={params.spaitalProximity}
              onChange={(e, checked) =>
                setParams({
                  ...params,
                  spaitalProximity: checked,
                })
              }
            />
            <ul>
              <li>Time to Closest Destination</li>
              <li>Count of Accessiable Destinations</li>
              <li>Spatial Accss Score</li>
            </ul>
          </Grid>
          <Grid item>
            <FormControlLabel
              control={<Checkbox />}
              label={"Measures of Origins' Spatial Proximity to Destinations"}
              checked={params.catchmentAreas}
              onChange={(e, checked) =>
                setParams({
                  ...params,
                  catchmentAreas: checked,
                })
              }
            />
            <ul>
              <li>Number of People within Travel Time</li>
              <li>Per Capita Spending</li>
            </ul>
          </Grid>
          <Grid item>
            <FormControl fullWidth>
              <InputLabel id="travel-mode-label">
                Travel Mode 
              </InputLabel>
              <Select
                labelId="travel-mode-label"
                id="tarvel-mode"
                value={params.travelMode}
                label="Travel Mode"
                onChange={(e) => {
                  setParams({
                    ...params,
                    //@ts-ignore
                    travelMode: e.target.value,
                  });
                }}
              >
                <MenuItem value={"walk"}>Walking</MenuItem>
                <MenuItem value={"drive"}>Driving</MenuItem>
                <MenuItem value={"bike"}>Biking</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Typography gutterBottom>Max Travel (mins): {formatTime(params.upperThreshold!)}</Typography>

            <Slider
              aria-label="Min Travel Distance"
              value={params.upperThreshold}
              valueLabelFormat={(minutes:number, index:number)=> formatTime(minutes) }
              valueLabelDisplay="auto"
              min={1}
              max={24*60}
              onChange={(e, val) =>
                setParams({
                  ...params,
                  upperThreshold: Array.isArray(val) ? val[0] : val,
                })
              }
            />
          </Grid>
        </Grid>
      </FormGroup>
    </Section>
  );
};
