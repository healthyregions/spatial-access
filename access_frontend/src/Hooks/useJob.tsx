import { useState, useEffect, useCallback } from "react";
import { Job } from "../Types/Job";

export const initalJob: Job = {
	mode: "car",
	geom: "tract",
	threshold: 30,
	destinationFormat: "point",
	includeModelMetrics: false,
	populationSource: "census",
};

export const useJob = () => {
	const [job, setJob] = useState<Job | null>(null);

	useEffect(() => {
		if (job === null) {
      /**
       * /*
      Because a saved job can cause caching issues and lead the app to believe there's a saved file, 
      remove the saved job from local storage whenever the user refreshes the page.
      Then, set the job state back to the initial job.
      */
      setJob(initalJob);
		} else {
			console.log("Setting local storage ", job);
			localStorage.setItem("job", JSON.stringify(job));
		}
	}, [job]);

	const resetJob = useCallback(() => {
		setJob(initalJob);
	}, []);

	return { job, setJob, resetJob };
};
