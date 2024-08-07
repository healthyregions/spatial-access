import React from "react";

import "./App.css";
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	ThemeProvider,
	Toolbar,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import { createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { Job } from "./Types/Job";

// sections
// import TravelModeSection from "./Components/Sections/TravelModeSection";
// import GeomUnitSection from "./Components/Sections/GeomUnitSection";
// import TravelTimeSection from "./Components/Sections/TravelTimeSection";

// icons
// import ShouldIncludeModelSection from "./Components/Sections/ShouldIncludeModelSection";
// import PopulationDataSection from "./Components/Sections/PopulationDataSection";
// import CapacitySelectionSection from "./Components/Sections/CapacitySelectionSection";
// import CategorySelectionSection from "./Components/Sections/CategorySelectionSection";
// import WeightSelectionSection from "./Components/Sections/WeightSelectionSection";
// import ModelSelectionSection from "./Components/Sections/ModelSelectionSection";
// import DestinationInputFormatSection from "./Components/Sections/DestinationsInputFormatSection";
// import DestinationFileUploadSection from "./Components/Sections/DestinationFileUploadSection";
// import OutputFormatSection from "./Components/Sections/OutputFormatSection"
// import JobRunnerSection from './Components/Sections/JobRunnerSection'
import { themeOptions } from "./theme";
import { NavLink, Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "./Pages/Home";
import AboutPage from "./Pages/About";
import MethodologyPage from "./Pages/Methodlogy";

const theme = createTheme(themeOptions);

export interface SectionComponentSpec {
	job: Job;
	onUpdate: (j: Partial<Job>) => void;
	resetJob: () => void;
}

export interface SectionSpec {
	name: string;
	canProgress: (j: Job) => boolean;
	shouldShow: (j: Job, step: number) => boolean;
	component: React.FC<SectionComponentSpec>;
	prompt: (j: Job) => string;
	tooltip: (j: Job) => string;
	additionalDescription?: React.FC<{ job: Job }>;
}

// const Sections: SectionSpec[] = [
//   TravelModeSection,
//   GeomUnitSection,
//   TravelTimeSection,
//   ShouldIncludeModelSection,
//   PopulationDataSection,
//   CapacitySelectionSection,
//   CategorySelectionSection,
//   ModelSelectionSection,
//   WeightSelectionSection,
//   DestinationInputFormatSection,
//   DestinationFileUploadSection,
//   OutputFormatSection,
//   JobRunnerSection
// ];

function App() {
	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const navItems = [
		{ name: "Home", url: "/" },
		{ name: "About", url: "/about" },
		{ name: "Methodology", url: "/methodology" },
	];

	const drawer = (
		<Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
			<Typography variant="h6" sx={{ my: 2 }}>
				Spatial Access Calculator
			</Typography>
			<Divider />
			<List>
				{navItems.map((item) => (
					<ListItem key={item.name} disablePadding>
						<NavLink to={item.url}>
							<ListItemButton sx={{ textAlign: "center" }}>
								<ListItemText primary={item.name} />
							</ListItemButton>
						</NavLink>
					</ListItem>
				))}
			</List>
		</Box>
	);

	const container = window !== undefined ? () => document.body : undefined;

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Box sx={{ display: "flex" }}>
					<AppBar sx={{ padding: "20px 0px 10px 10px" }} position={"fixed"}>
						<Toolbar>
							<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
								Spatial Access
							</Typography>
							<IconButton
								color="inherit"
								aria-label="open drawer"
								edge="start"
								onClick={handleDrawerToggle}
								sx={{ mr: 2, display: { sm: "none" } }}
							>
								<MenuIcon />
							</IconButton>
							<Box sx={{ display: { xs: "none", sm: "block" } }}>
								{navItems.map((item) => (
									<NavLink to={item.url}>
										<Button key={item.name} sx={{ color: "#fff" }}>
											{item.name}
										</Button>
									</NavLink>
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
									display: { xs: "block", sm: "none" },
									"& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
								}}
							>
								{drawer}
							</Drawer>
						</Box>
					</AppBar>
				</Box>
				<Box sx={{ marginTop: "120px" }}>
					<Routes>
						<Route path="/" element={<HomePage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="/methodology" element={<MethodologyPage />} />
					</Routes>
				</Box>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
