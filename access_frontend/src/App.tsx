import React, { useState } from "react";
import logo from "./logo.svg";

import "./App.css";
import { Box, Button, Grid, ThemeProvider } from "@mui/material";

import { createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { CalculationSettings, ODFileDetails } from "./types";
import { CalculationParametersSection } from "./CalculationParametersSection";
import { UploadODFileSection } from "./UploadODFileSection";
import {JobRunner} from "./JobRunner";

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
  const [calculationSettings, setCalculationSettings] =
    useState<CalculationSettings | null >(null);

  const [originFileDetails, setOriginFileDetails] =
    useState<ODFileDetails | null>(null);

  const [destinationFileDetails, setDestinationFileDetails] =
    useState<ODFileDetails | null>(null);


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

      <Box sx={{width:"100vw", overflowY:'auto', paddingBottom:"200px", boxSizing:'border-box'}}>

      <Grid
        container
        direction="column"
        width={"1000px"}
        sx={{ margin: "auto", overflowY: "auto" }}
      >
        <Grid item>
          <CalculationParametersSection onDone={setCalculationSettings} />
        </Grid>
        <Grid item>
          <UploadODFileSection
            onChange={setOriginFileDetails}
            title={"Add Origins"}
            variant={"dark"}
            imageUrl={"origins_pic.png"}
            amountColLabel={"Population Col"}
          />
          <UploadODFileSection
            includeCategory={true}
            onChange={setDestinationFileDetails}
            title={"Add Destinations"}
            imageUrl={"destinations_pic.png"}
            amountColLabel={"Capacity Col"}
          />
        </Grid>
        {calculationSettings && originFileDetails && destinationFileDetails &&(
          <Grid item>
            <JobRunner calcParams={calculationSettings} originParams={originFileDetails} destParams={destinationFileDetails} />
          </Grid>
        )}
      </Grid>
    </Box>
    </ThemeProvider>
  );
}

export default App;
