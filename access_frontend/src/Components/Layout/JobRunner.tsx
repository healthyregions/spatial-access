import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { Job } from "../../Types/Job";
import { useJobRunner } from "../../Hooks/useJobRunner";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface JobRunnerProps {
	job: Job;
	destinationFile?: File;
	populationFile?: File;
	resetJob: () => void;
}

export const JobRunner: React.FC<JobRunnerProps> = ({ job, resetJob }) => {
	const { result, error, run, status, isValid } = useJobRunner(job);
	if (error) console.log("error is ", error);
	return (
		<>
			{status === "pending" && (
				<Grid item xs={12} sx={{ textAlign: "right" }}>
					<Button
						sx={{ margin: "3rem auto", marginRight: "1rem" }}
						size="large"
						onClick={() => window.location.reload()}
						variant="contained"
					>
						Restart Process
					</Button>
					<Button
						sx={{ margin: "3rem auto" }}
						size="large"
						onClick={() => run()}
						variant="contained"
						disabled={!isValid}
					>
						Submit Job
					</Button>
				</Grid>
			)}

			{error && (
				<div style={{ marginTop: "10px" }}>
					<Typography sx={{ color: "red", marginTop: "10px" }}>
						Something went wrong: {error}
					</Typography>
					<Typography>
						Check your input files and some of your settings and try again
					</Typography>
				</div>
			)}

			{status === "done" && result && (
				<Grid item xs={12} sx={{ textAlign: "right" }}>
					<Button
						sx={{ margin: "3rem auto", marginRight: "1rem" }}
						size="large"
						onClick={() => window.location.reload()}
						variant="contained"
					>
						Restart Process
					</Button>
					<a
						href={result.result_url}
						style={{ textDecoration: "none", width: "100%" }}
					>
						<Button
							sx={{ margin: "3rem auto" }}
							size="large"
							variant={"contained"}
						>
							Download Results
						</Button>
					</a>
				</Grid>
				// <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
				// <a
				// 	href={result.result_url}
				// 	style={{ textDecoration: "none", width: "100%" }}
				// >
				// 	<Button variant={"contained"}>Download Results</Button>
				// </a>
				// 	<Button
				// 		disabled={!isValid}
				// 		onClick={() => run()}
				// 		variant={"contained"}
				// 	>
				// 		Run again
				// 	</Button>
				// 	<Button
				// 		disabled={!isValid}
				// 		onClick={() => resetJob()}
				// 		variant={"contained"}
				// 	>
				// 		Start over
				// 	</Button>
				// </div>
			)}

			{status === "running" && (
				<Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
					{status}
					<CircularProgress />
				</Box>
			)}
		</>
	);
};
