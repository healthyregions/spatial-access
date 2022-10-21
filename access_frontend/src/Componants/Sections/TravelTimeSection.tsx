import React from "react";
import { Slider, Stack, Typography } from "@mui/material";

import { Job } from "../../Types/Job";
import { SectionComponentSpec } from "../../App";

function formatTime(minutes: number) {
  return minutes < 60
    ? `${minutes}`
    : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

const TravelTimeComponent: React.FC<SectionComponentSpec> = ({
  onUpdate,
  job,
}) => {
  const { threshold } = job;

  return (
    <Stack direction="column" spacing={2} width="50%">
      <Typography gutterBottom>
        Max Travel Time (mins): {formatTime(threshold)}
      </Typography>

      <Slider
        aria-label="Min Travel Distance"
        value={threshold}
        valueLabelFormat={(minutes: number, index: number) =>
          formatTime(minutes)
        }
        valueLabelDisplay="auto"
        min={9}
        max={90}
        step={1}
        onChange={(e, val) =>
          onUpdate({
            threshold: Array.isArray(val) ? val[0] : val,
          })
        }
      />
    </Stack>
  );
};

const canProgress = (_job: Job) => true;
const shouldShow = (_job: Job, _step: number) => true;
const prompt = (_job: Job) => "How long is your community willing to travel?";
const tooltip = (_job: Job) =>
  "This determines the threshold for the maximum travel time to access a destination.";

const TravelTimeSection = {
  component: TravelTimeComponent,
  canProgress,
  shouldShow,
  prompt,
  tooltip,
  name:"TravelTimeSection"
};

export default TravelTimeSection;
