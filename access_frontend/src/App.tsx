import React, { useState } from "react";

import "./App.css";
import { Box, Button, Grid, ThemeProvider } from "@mui/material";

import { createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
// import { CalculationSettings, ODFileDetails } from "./types";
import { CalculationParametersSection } from "./CalculationParametersSection";
// import { UploadODFileSection } from "./UploadODFileSection";
// import { JobRunner } from "./JobRunner";
import { Job } from "./Job";
import { DestinationsStep } from "./DestinationsStep";
import { AdditionalMetricsStep} from "./AdditionalMetrics";
import {FileSelection} from "./FileSelection";

const theme = createTheme({
  palette: {
    //@ts-ignore
    type: "light",
    primary: {
      main: "#FF5757",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

function App() {

  const [job, setJob] = useState<Job>({
    mode: "car",
    geom: "tract",
    threshold: 30,
    destinationFormat: "point",
    includeAccessModel:false,
    includeGravityModel:false, 
    populationSource: 'census'
  });

  const [destinationFile, setDestinationFile] = useState<File|null>(null)
  const [populationFile, setPopulationFile] = useState<File|null>(null)

  const [steps, setSteps] = useState<Record<string,boolean>>({
    basics:false,
    metrics:false,
    destFormat:false,
    uploads:false
  })


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        <AppBar position="static" sx={{ padding: "20px 0px 10px 10px" }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Calculate Spatial Access and Coverage
          </Typography>
        </AppBar>
      </Box>

      <Box
        sx={{
          width: "100vw",
          overflowY: "auto",
          paddingBottom: "200px",
          boxSizing: "border-box",
        }}
      >
        <Grid
          container
          direction="column"
          width={"1000px"}
          sx={{ margin: "auto", overflowY: "auto" }}
        >
          <Grid item>
            <CalculationParametersSection
              onNextStep={() => setSteps({...steps,basics:true})}
              onUpdate={(update) => setJob({ ...job, ...update })}
              mode={job.mode}
              threshold={job.threshold}
              geom={job.geom}
            />
          </Grid>
          {steps.basics &&
            <Grid item>
              <AdditionalMetricsStep
                onUpdate={(update) => setJob({...job,...update})}
                onNextStep={() => setSteps({...steps, metrics:true})}
                job={job}
            />
            </Grid>
          }
          {steps.metrics &&
            <Grid item>
              <DestinationsStep
                onUpdate={(update)=> setJob({...job,...update})}
                onNextStep={() => setSteps({...steps, destinationFormat:true})}
                job={job}
              />
            </Grid>
          }
          {steps.destinationFormat &&
            <Grid item>
              <FileSelection
                onUpdate={(update) => setJob({...job, ...update})}
                onNextStep={() => setSteps({...steps, uploads:true})}
                title={"File selection"}
                imageUrl={""} 
                job={job}
              />
            </Grid>
          }
          {steps.uploads && 
            <Grid item>
              <Button variant="contained">Process</Button>
            </Grid>
          }
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
