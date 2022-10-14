import React, { useEffect, useLayoutEffect, useState } from "react";

import "./App.css";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  ThemeProvider,
  Tooltip,
} from "@mui/material";

import { createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
// import { CalculationSettings, ODFileDetails } from "./types";
// import { CalculationParametersSection } from "./Componants/Sections/CalculationParametersSection";
// import { UploadODFileSection } from "./UploadODFileSection";
// import { JobRunner } from "./JobRunner";
import { Job } from "./Job";
// import { DestinationsStep } from "./Componants/Sections/DestinationsStep";
// import { AdditionalMetricsStep } from "./Componants/Sections/AdditionalMetrics";
// import { FileSelection } from "./Componants/Sections/FileSelection";

// sections
import TravelModeSection from "./Componants/Sections/TravelModeSection";
import GeomUnitSection from "./Componants/Sections/GeomUnitSection";
import TravelTimeSection from "./Componants/Sections/TravelTimeSection";

// icons
import InfoIcon from "@mui/icons-material/Info";
import ShouldIncludeModelSection from "./Componants/Sections/ShouldIncludeModelSection";
import PopulationDataSection from "./Componants/Sections/PopulationDataSection";
import CapacitySelectionSection from "./Componants/Sections/CapacitySelectionSection";
import CategorySelectionSection from "./Componants/Sections/CategorySelectionSection";
import WeightSelectionSection from "./Componants/Sections/WeightSelectionSection";
import ModelSelectionSection from "./Componants/Sections/ModelSelectionSection";
import DestinationInputFormatSection from "./Componants/Sections/DestinationsInputFormatSection";
import DestinationFileUploadSection from "./Componants/Sections/DestinationFileUploadSection";
import { JobRunner } from "./JobRunner";

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

export interface SectionComponentSpec {
  job: Job;
  onUpdate: (j: Partial<Job>) => void;
}

export interface SectionSpec {
  canProgress: (j: Job) => boolean;
  shouldShow: (j: Job, step: number) => boolean;
  component: React.FC<SectionComponentSpec>;
  prompt: (j: Job) => string;
  tooltip: (j: Job) => string;
  additionalDescription?: React.FC<{job: Job}>;
}

const Sections: SectionSpec[] = [
  TravelModeSection,
  GeomUnitSection,
  TravelTimeSection,
  ShouldIncludeModelSection,
  PopulationDataSection,
  CapacitySelectionSection,
  CategorySelectionSection,
  ModelSelectionSection,
  WeightSelectionSection,
  DestinationInputFormatSection,
  DestinationFileUploadSection
];

function App() {
  const [job, setJob] = useState<Job>({
    mode: "car",
    geom: "tract",
    threshold: 30,
    destinationFormat: "point",
    includeModelMetrics: false,
    populationSource: "census",
  });

  const [destinationFile, setDestinationFile] = useState<File | null>(null);
  const [populationFile, setPopulationFile] = useState<File | null>(null);

  const [step, setStep] = useState<number>(0);
  useLayoutEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [step]);

  // SubmitSection,
  // ResultSection
  const handleUpdate = (j: Partial<Job>) => {
    setJob({ ...job, ...j });
  };
  const ActiveSections = Sections.filter((section) =>
    section.shouldShow(job, step)
  );
  const canProgress = ActiveSections.slice(-1)[0].canProgress(job);

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
          paddingBottom: "200px",
          px: 3,
          boxSizing: "border-box",
        }}
      >
        <Grid
          container
          direction="row"
          maxWidth={"1200px"}
          width="100%"
          sx={{ margin: "auto" }}
          rowSpacing={10}
          columnSpacing={2}
        >
          {ActiveSections.map((section, i) => (
            <>
              <Grid item xs={12} md={6} lg={6} className="fade-in">
                <Stack direction="row" spacing={1} alignItems="center" sx={{mr: 2, mb: 4}}>
                  <Typography variant="h5" fontWeight="bold">
                    {section.prompt(job)}
                  </Typography>
                  <Tooltip title={section.tooltip(job)}>
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
                {!!section.additionalDescription && section.additionalDescription({job})}
              </Grid>
              <Grid item xs={12} md={6} lg={6} className="fade-in">
                {section.component({ job, onUpdate: handleUpdate })}
              </Grid>
            </>
          ))}
          <Grid item xs={12}>

          <Button
            sx={{ margin: "3rem auto" }}
            size="large"
            onClick={() => setStep(prev => prev + 1)}
            variant="contained"
            disabled={!canProgress}
            >
            Next
          </Button>
          </Grid>
          <Grid item xs={12}>
            <JobRunner job={job} destinationFile={job.destinationFile} populationFile={job.populationFile} />
          </Grid>
          {/* <Grid item>
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
          } */}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
