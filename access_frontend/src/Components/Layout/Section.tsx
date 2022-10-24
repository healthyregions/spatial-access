import React, { PropsWithChildren } from "react";
import { Box, Typography } from "@mui/material";

interface SectionProps {
  title: string;
  imageUrl?: string;
  variant? : "dark" | "light"
}

export const Section: React.FC<PropsWithChildren<SectionProps>> = ({
  title,
  imageUrl,
  children,
  variant = "light"
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "30px",
        backgroundColor: variant==='dark' ? "#F3F3F3" : "inherit",
      }}
    >
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" sx={{color: "#373a3c", fontWeight:100 }}>{title}</Typography>

        {imageUrl && <img src={imageUrl} alt="compute parameter icon" />}
      </Box>
      <Box sx={{ padding: "20px" }}>{children}</Box>
    </Box>
  );
};
