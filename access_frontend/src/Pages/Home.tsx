import React, { useLayoutEffect, useState } from "react";

import "../App.css";
import {
	Alert,
	Box,
	Button,
	Grid,
	IconButton,
	Stack,
	Tooltip,
} from "@mui/material";
import Typography from "@mui/material/Typography";

import { Job } from "../Types/Job";

// sections
import TravelModeSection from "../Components/Sections/TravelModeSection";
import GeomUnitSection from "../Components/Sections/GeomUnitSection";
import TravelTimeSection from "../Components/Sections/TravelTimeSection";

// icons
import InfoIcon from "@mui/icons-material/Info";
import ShouldIncludeModelSection from "../Components/Sections/ShouldIncludeModelSection";
import PopulationDataSection from "../Components/Sections/PopulationDataSection";
import CapacitySelectionSection from "../Components/Sections/CapacitySelectionSection";
import CategorySelectionSection from "../Components/Sections/CategorySelectionSection";
import WeightSelectionSection from "../Components/Sections/WeightSelectionSection";
import ModelSelectionSection from "../Components/Sections/ModelSelectionSection";
import DestinationInputFormatSection from "../Components/Sections/DestinationsInputFormatSection";
import DestinationFileUploadSection from "../Components/Sections/DestinationFileUploadSection";
import OutputFormatSection from "../Components/Sections/OutputFormatSection";
import JobRunnerSection from "../Components/Sections/JobRunnerSection";
import { useJob } from "../Hooks/useJob";
import { compareWithNumber } from "../../../../../PDL/pdl-original/src/components/shared/TableCompareFunctions";

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
	JobRunnerSection,
];

function HomePage() {
	const { job, setJob, resetJob } = useJob();

	const [step, setStep] = useState<number>(0);
	useLayoutEffect(() => {
		window.scrollTo(0, document.body.scrollHeight);
	}, [step]);

	const handleUpdate = (j: Partial<Job>) => {
		if (job) {
			setJob({ ...job, ...j });
		}
	};
	const ActiveSections = Sections.filter((section) => {
		if (job) {
			return section.shouldShow(job, step);
		} else {
			return false;
		}
	});

	const canProgress = job
		? ActiveSections.slice(-1)[0].canProgress(job)
		: false;

	return (
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
				<Grid
					item
					xs={12}
					md={6}
					lg={6}
					className="fade-in"
					spacing={12}
					textAlign="center"
				>
					<img src="/calculate_pic.png" alt="A graphic denoting calculation" />
				</Grid>
				<Grid
					item
					xs={12}
					md={6}
					lg={6}
					className="fade-in"
					sx={{ width: "100%" }}
				>
					<Typography variant="body2" sx={{ mb: 3 }}>
						Welcome to the Access App. You can use this web page to calculate
						access to resources based on different transit modes. The
						application will ask you a series of questions and based on those
						answers it will then ask you to upload a couple of files describing
						the resources you are interested in.
					</Typography>
					<Alert severity="info">
						<Box sx={{ mb: 1 }}>
							For now, this application is not compatible of processing csv
							files with more than <b>3MB</b>. You may see <i>infinite job running
							status</i> if you try to run a job with a file larger than 3MB.
						</Box>
						<Box>
							For larger file, please consider splitting it into
							smaller files or using our{" "}
							<a href="https://colab.research.google.com/drive/1KXdKgKnXiRlKOuiSDVaBzplr7nrKy64B?usp=sharing#scrollTo=cmHary0c6CNn">
								CoLab Notebook
							</a>
							.
						</Box>
					</Alert>
				</Grid>
				{job &&
					ActiveSections.map((section, i) => {
						return (
							<>
								<Grid
									item
									xs={12}
									md={6}
									lg={6}
									className="fade-in"
									spacing={12}
								>
									<Stack
										direction="row"
										spacing={1}
										alignItems="flex-start"
										justifyContent="space-between"
										sx={{ mr: 2, mb: 4 }}
									>
										<Typography variant="h4" fontWeight="bold" color="#373a3c">
											{section.prompt(job)}
										</Typography>
										<Tooltip title={section.tooltip(job)}>
											<IconButton>
												<InfoIcon />
											</IconButton>
										</Tooltip>
									</Stack>
									{!!section.additionalDescription &&
										section.additionalDescription({ job })}
								</Grid>
								<Grid
									item
									xs={12}
									md={6}
									lg={6}
									className="fade-in"
									sx={{ width: "100%" }}
								>
									{section.component({
										job,
										onUpdate: handleUpdate,
										resetJob: resetJob,
									})}
								</Grid>
							</>
						);
					})}
				{job &&
					ActiveSections[ActiveSections.length - 1].name !==
						"JobRunnerSection" && (
						<Grid item xs={12} sx={{ textAlign: "right" }}>
							<Button
								sx={{ margin: "3rem auto" }}
								size="large"
								onClick={() => setStep((prev) => prev + 1)}
								variant="contained"
								disabled={!canProgress}
							>
								Next
							</Button>
						</Grid>
					)}
			</Grid>
		</Box>
	);
}

export default HomePage;
