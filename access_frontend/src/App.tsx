import React, { useEffect, useLayoutEffect, useState } from "react";

import "./App.css";
import {
  Box,
  Button,
  Divider, Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
} from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';


import { createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar"; import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { Job } from "./Types/Job";

// sections
import TravelModeSection from "./Components/Sections/TravelModeSection";
import GeomUnitSection from "./Components/Sections/GeomUnitSection";
import TravelTimeSection from "./Components/Sections/TravelTimeSection";

// icons
import InfoIcon from "@mui/icons-material/Info";
import ShouldIncludeModelSection from "./Components/Sections/ShouldIncludeModelSection";
import PopulationDataSection from "./Components/Sections/PopulationDataSection";
import CapacitySelectionSection from "./Components/Sections/CapacitySelectionSection";
import CategorySelectionSection from "./Components/Sections/CategorySelectionSection";
import WeightSelectionSection from "./Components/Sections/WeightSelectionSection";
import ModelSelectionSection from "./Components/Sections/ModelSelectionSection";
import DestinationInputFormatSection from "./Components/Sections/DestinationsInputFormatSection";
import DestinationFileUploadSection from "./Components/Sections/DestinationFileUploadSection";
import OutputFormatSection from "./Components/Sections/OutputFormatSection"
import JobRunnerSection from './Components/Sections/JobRunnerSection'
import {themeOptions} from './theme'

const theme = createTheme(themeOptions);

export interface SectionComponentSpec {
  job: Job;
  onUpdate: (j: Partial<Job>) => void;
}

export interface SectionSpec {
  name: string,
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
  DestinationFileUploadSection,
  OutputFormatSection,
  JobRunnerSection
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

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [  {name: 'About', url : ""}, {name: 'Methodology', url : ""}, {name:'Contact', url:""} ];


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Spatial Accesss Calculator 
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );


  const container = window !== undefined ? () => document.body : undefined;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: "flex" }}>
        <AppBar sx={{ padding: "20px 0px 10px 10px"}} position={"fixed"}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Spatial Access
          </Typography>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon/>
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item.name} sx={{ color: '#fff' }}>
                {item.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240},
              }}
            >
              {drawer}
            </Drawer>
          </Box>
        </AppBar>
      </Box>


      <Box
        sx={{
          paddingBottom: "200px",
          marginTop:"70px",
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
              <Grid item xs={12} md={6} lg={6} className="fade-in" spacing={12} textAlign='center'>
                <img src="/calculate_pic.png" alt="A graphic denoting calculation"  /> 
              </Grid>
              <Grid item xs={12} md={6} lg={6} className="fade-in" sx={{width:"100%"}}>
                <Typography variant='body1'>
                Welcome to the Acces App. You can use this web page to calculate access to resources based on different transit modes.
                The application will ask you a series of questions and based on those answers it will then ask you to upload a couple of files 
                describing the resources you are interested in. 
                  </Typography>
              </Grid>
          {ActiveSections.map((section, i) => (
            <>
              <Grid item xs={12} md={6} lg={6} className="fade-in" spacing={12}>
                <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between"  sx={{mr: 2, mb: 4}}>
                  <Typography variant="h4" fontWeight="bold" color="#373a3c">
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
              <Grid item xs={12} md={6} lg={6} className="fade-in" sx={{width:"100%"}}>
                {section.component({ job, onUpdate: handleUpdate })}
              </Grid>
            </>
          ))}
          {(ActiveSections[ActiveSections.length-1].name!=="JobRunnerSection") &&
          <Grid item xs={12} sx={{textAlign:"right"}}>

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
          }
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
