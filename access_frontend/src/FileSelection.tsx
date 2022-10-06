import { Button, FormGroup, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Section } from "./Section";
import { useDropzone } from "react-dropzone";
import { InputForDetail } from "./InputForDetail";
import { useFileColumns } from "./useFileColumns";
import { Job } from "./Job";
import {JobRunner} from "./JobRunner";

interface FileSelectionProps {
  onUpdate: (detials: Partial<Job>) => void;
  onNextStep: () => void;
  variant?: "light" | "dark";
  title: string;
  imageUrl: string;
  includeCategory?: boolean;
  includeWeight?: boolean;
  includeCapacity?: boolean;
  job: Job;
}

interface DestinationFileSelectionProps {
  onUpdate: (detials: Partial<Job>) => void;
  onFile: (file: File | undefined) => void;
  job: Job;
  file: File | undefined;
}

interface PopulationFileSelectionProps {
  onUpdate: (detials: Partial<Job>) => void;
  onFile: (file: File | undefined) => void;
  job: Job;
  file: File | undefined;

}

export const PopulationFileSelection: React.FC<
  PopulationFileSelectionProps
> = ({ onUpdate, onFile, file, job}) => {
  const onDrop = useCallback(
    (files: Array<File>) => {
      onFile(files[0]);
    },
    [onFile]
  );

  //TODO use error to report errors
  const { columns, error } = useFileColumns(file);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  useEffect(() => {
    if (error) {
      onFile(undefined);
    }
  }, [error]);

  const inputsActive = file && columns ? false : true;

  if (!file) {
    return (
      <section style={{ marginBottom: "20px" }}>
        <Typography variant="h5">Population File</Typography>
        <Typography variant="body1">
          Please select a csv file containing your population estimates
          <ul>
            <li>
              A column which has the{" "}
              {job.geom === "tract" ? "Census tract id" : "zip code"} for each
              source
            </li>
            <li>A column indicating the population at each source</li>
          </ul>
        </Typography>
        <Button variant="contained" component="label" {...getRootProps}>
          {isDragActive ? "Drop here" : "Select Population File"}
          <input type="file" hidden {...getInputProps()} />
        </Button>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "20px" }}>
      <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
        <Grid container direction={"column"} spacing={3}>
          {file && (
            <Grid item>
              <Typography variant="h6">
                You selected the file: {file.name}
              </Typography>
              <Typography variant="body1">
                Next, map each input to a column in your dataset
              </Typography>
            </Grid>
          )}
          <Grid item>
            <InputForDetail
              value={job.sourceIdColumn}
              items={columns ?? []}
              title={`Column containing the ${
                job.geom === "tract" ? "Census tract id " : "Zip code"
              } of the source population`}
              onChange={(sourceIdColumn) => onUpdate({ sourceIdColumn })}
              disabled={inputsActive}
            />
          </Grid>
          <Grid item>
            <InputForDetail
              value={job.destLatCol}
              items={columns ?? []}
              title={"Column containing the population value for each source"}
              onChange={(destLatCol) => onUpdate({ destLatCol })}
              disabled={inputsActive}
            />
          </Grid>
        </Grid>
      </FormGroup>
    </section>
  );
};

export const DestinationFileSelection: React.FC<
  DestinationFileSelectionProps
> = ({
  onUpdate,
  onFile,
  file,
  job,
}) => {
  const onDrop = useCallback(
    (files: Array<File>) => {
      onFile(files[0]);
    },
    [onFile]
  );

  //TODO use error to report errors
  const { columns, error } = useFileColumns(file);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
  });

  useEffect(() => {
    if (error) {
      onFile(undefined);
    }
  }, [error]);

  const inputsActive = file && columns ? false : true;

  if (!file) {
    return (
      <section style={{ marginBottom: "20px" }}>
        <Typography variant="h5">Destination File</Typography>
        <Typography variant="body1">
          Please select a csv file containing your destinations with the
          following columns
          <ul>
            <li>A column which has a unique id for each destination</li>
            {job.destinationFormat === "point" ? (
              <>
                <li>A column containig the latitude</li>
                <li>A column containing the longitude</li>
              </>
            ) : (
              <li>
                A column contaning the{" "}
                {job.geom === "tract"
                  ? "id of the census tract the destination is in "
                  : "zip code of the destination"}
              </li>
            )}
            {job.useCapacity && (
              <li>
                A column indicating the number of people the destination can
                accomidate
              </li>
            )}
            {job.useCategory && (
              <li>A column indicating the category of each destination</li>
            )}
            {job.useWeights && (
              <li>
                A column indicating a weighting value for each destination
              </li>
            )}
          </ul>
        </Typography>
        <Button variant="contained" component="label" {...getRootProps}>
          {isDragActive ? "Drop here" : "Select Destination File"}
          <input type="file" hidden {...getInputProps()} />
        </Button>
      </section>
    );
  }

  return (
    <section style={{ marginBottom: "20px" }}>
      <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
        <Grid container direction={"column"} spacing={3}>
          {file && (
            <Grid item>
              <Typography variant="h6">
                You selected the file: {file.name}
              </Typography>
              <Typography variant="body1">
                Next, map each input to a column in your dataset
              </Typography>
            </Grid>
          )}
          <Grid item>
            <InputForDetail
              value={job.destIdCol}
              items={columns ?? []}
              title={"Unique Id Col"}
              onChange={(destIdCol) => onUpdate({ destIdCol })}
              disabled={inputsActive}
            />
          </Grid>
          {job.destinationFormat === "point" ? (
            <>
              <Grid item>
                {" "}
                <InputForDetail
                  value={job.destLatCol}
                  items={columns ?? []}
                  title={"Latitude Col"}
                  onChange={(destLatCol) => onUpdate({ destLatCol })}
                  disabled={inputsActive}
                />
              </Grid>
              <Grid item>
                <InputForDetail
                  value={job.destLngCol}
                  items={columns ?? []}
                  title={"Longitude Col"}
                  onChange={(destLngCol) => onUpdate({ destLngCol})}
                  disabled={inputsActive}
                />
              </Grid>
            </>
          ) : (
            <Grid item>
              <InputForDetail
                value={job.destAdminCol}
                items={columns ?? []}
                title={
                  job.geom === "tract"
                    ? "Census Tract ID Column"
                    : "Zip Code Column"
                }
                onChange={(destAdminCol) => onUpdate({ destAdminCol })}
                disabled={inputsActive}
              />
            </Grid>
          )}
          {job.useCapacity && (
            <Grid item>
              <InputForDetail
                value={job.capacityColumn}
                items={columns ?? []}
                title={"Destination Capacity Column"}
                onChange={(capacityColumn) => onUpdate({ capacityColumn })}
                disabled={inputsActive}
              />
            </Grid>
          )}
          {job.useCategory && (
            <Grid item>
              <InputForDetail
                value={job.categoryColumn}
                items={columns ?? []}
                title={"Destination Category Column"}
                onChange={(categoryColumn) => onUpdate({ categoryColumn })}
                disabled={inputsActive}
              />
            </Grid>
          )}
          {job.useWeights && (
            <Grid item>
              <InputForDetail
                value={job.weightColumn}
                items={columns ?? []}
                title={"Destination Weight Column"}
                onChange={(weightColumn) => onUpdate({ weightColumn })}
                disabled={inputsActive}
              />
            </Grid>
          )}
        </Grid>
      </FormGroup>
    </section>
  );
};

export const FileSelection: React.FC<FileSelectionProps> = ({
  onUpdate,
  job,
  variant = "light",
  title,
  imageUrl,
  includeCategory = false,
  includeWeight = false,
  includeCapacity = false,
}) => {
  const [destinationFile, setDestinationFile] = useState<File | undefined>(
    undefined
  );
  const [populationFile, setPopulationFile] = useState<File | undefined>(
    undefined
  );
  const requiresPopulationFile = (job.includeAccessModel || job.includeGravityModel) && job.populationSource === "custom"
  const [running, setRunning] = useState(false)
  console.log(job)

  return (
    <Section title={title} variant={variant} imageUrl={imageUrl}>
      <DestinationFileSelection
        onUpdate={onUpdate}
        onFile={(file) => setDestinationFile(file)}
        job={job}
        file={destinationFile}
      />
      { requiresPopulationFile && (
          <PopulationFileSelection
            onUpdate={onUpdate}
            onFile={(file) => setPopulationFile(file)}
            job={job}
            file={populationFile}
          />
        )}
        <JobRunner job={job} destinationFile={destinationFile} populationFile={populationFile} />
    </Section>
  );
};
