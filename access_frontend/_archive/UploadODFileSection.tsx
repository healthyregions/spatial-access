export const test="test"
// import { Button, FormGroup, Grid, Typography } from "@mui/material";
// import React, { useCallback, useEffect, useState } from "react";
// import { Section } from "./Section";
// import { useDropzone } from "react-dropzone";
// import { ODFileDetails } from "./types";
// import { InputForDetail } from "./InputForDetail";
// import { useUploadFile } from "./useUploadFile";

// interface UploadODFileSectionProps {
//   onChange: (detials: ODFileDetails) => void;
//   variant?: "light" | "dark";
//   title: string;
//   imageUrl: string;
//   includeCategory?: boolean;
//   amountColLabel? : string;
// }

// export const UploadODFileSection: React.FC<UploadODFileSectionProps> = ({
//   onChange,
//   variant = "light",
//   title,
//   imageUrl,
//   includeCategory = false,
//   amountColLabel = "Amount"
// }) => {
//   const [file, setFile] = useState<File | undefined>(undefined);
//   const [fileDetails, setFileDetails] = useState<Partial<ODFileDetails>>({});

//   const onDrop = useCallback((files: Array<File>) => {
//     setFile(files[0]);
//   }, []);

//   const { columns, resourceId, error } = useUploadFile(file);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     maxFiles: 1,
//   });

//   useEffect(() => {
//     setFileDetails({ ...fileDetails, resourceId });
//   }, [resourceId]);

//   useEffect(() => {
//     if (Object.values(fileDetails).every((d) => d)) {
//       onChange(fileDetails as ODFileDetails);
//     }
//   }, [fileDetails, onChange]);

//   useEffect(() => {
//     if (error) {
//       setFile(undefined);
//     }
//   }, [error]);

//   return (
//     <Section title={title} variant={variant} imageUrl={imageUrl}>
//       {error && (
//         <Typography sx={{ color: "red" }}>
//           Failed to upload file: {error.message}
//         </Typography>
//       )}
//       {!file && (
//         <Button variant="contained" component="label" {...getRootProps}>
//           {isDragActive ? "Drop here" : "Select File"}
//           <input type="file" hidden {...getInputProps()} />
//         </Button>
//       )}
//       {file && columns && (
//         <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
//           <Grid container direction={"column"} spacing={3}>
//             <Grid item>
//               <Typography>{file.name}</Typography>
//             </Grid>
//             <Grid item>
//               <InputForDetail
//                 value={fileDetails.idCol}
//                 items={columns}
//                 title={"Unique Id Col"}
//                 onChange={(idCol) => setFileDetails({ ...fileDetails, idCol })}
//               />
//             </Grid>
//             <Grid item>
//               <InputForDetail
//                 value={fileDetails.latitudeCol}
//                 items={columns}
//                 title={"Latitude Col"}
//                 onChange={(latitudeCol) =>
//                   setFileDetails({ ...fileDetails, latitudeCol })
//                 }
//               />
//             </Grid>
//             <Grid item>
//               <InputForDetail
//                 value={fileDetails.longitudeCol}
//                 items={columns}
//                 title={"Longitude Col"}
//                 onChange={(longitudeCol) =>
//                   setFileDetails({ ...fileDetails, longitudeCol })
//                 }
//               />
//             </Grid>
//             <Grid item>
//               <InputForDetail
//                 value={fileDetails.amountCol}
//                 items={columns}
//                 title={amountColLabel}
//                 onChange={(amountCol) =>
//                   setFileDetails({ ...fileDetails, amountCol })
//                 }
//               />
//             </Grid>
//             {includeCategory && (
//               <Grid item>
//                 <InputForDetail
//                   value={fileDetails.categoryCol}
//                   items={columns}
//                   title={"Category Col"}
//                   onChange={(categoryCol) =>
//                     setFileDetails({ ...fileDetails, categoryCol })
//                   }
//                 />
//               </Grid>
//             )}
//           </Grid>
//         </FormGroup>
//       )}
//     </Section>
//   );
// };
