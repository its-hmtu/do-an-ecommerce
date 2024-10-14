import React from "react";
import Dropzone from "react-dropzone";
import { Box, Typography } from "@mui/joy";


function DropZone({onDrop}) {
  return (
    <Dropzone onDrop={onDrop} accept="image/*" minSize={1024} maxSize={3072000}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        isDragAccept,
      }) => {
        const additionalClass = isDragAccept
          ? "active"
          : isDragReject
          ? "reject"
          : "";

        return (
          <Box
            sx={{
              minHeight: 200,
            }}
            {...getRootProps({
              className: `dropzone ${additionalClass}`,
            })}
          >
            <input {...getInputProps()} />

            <Typography
              variant="body"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                height: "100%",
                "& span:first-child": {
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0b6bcb",
                },
                "& span:last-child": {
                  fontSize: 12,
                  color: "neutral",
                },
              }}
            >
              <span>Click to upload</span>

              <span>or drag and drop image here</span>
            </Typography>
          </Box>
        );
      }}
    </Dropzone>
  );
}

export default DropZone;
