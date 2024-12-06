import React from "react";
import Dropzone from "react-dropzone";
import { Box, Typography } from "@mui/joy";

function DropZone({
  onDrop,
  minHeight,
  maxWidth,
  component,
  filesCount,
  maxFiles,
  disabled = false,
  isCoverImageDisabled = false,
}) {
  return (
    <Dropzone
      onDrop={onDrop}
      accept={{
        "image/jpeg": [],
        "image/png": [],
        "image/webp": [],
        "image/ipg": [],
      }}
      minSize={1024}
      maxSize={
        1024 * 1024 * 5 // 5MB
      }
      maxFiles={maxFiles}
      noClick={disabled}
      noKeyboard={disabled}
      noDrag={disabled}
    >
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

        const disabledClass = disabled ? "disabled" : "";

        return (
          <Box
            sx={{
              minHeight: minHeight || 200,
              maxWidth: maxWidth || 200,
              cursor: disabled ? "not-allowed" : "pointer",
              "&:hover": {
                backgroundColor: disabled ? "transparent" : "#f7f7f7",
              },
            }}
            {...getRootProps({
              className: `dropzone ${additionalClass}`,
            })}
          >
            <input {...getInputProps()} />

            {component ? (
              component
            ) : (
              <Typography
                variant="body"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  height: "100%",
                  "& span:first-of-type": {
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

                {filesCount > 0 ? (
                  <span>
                    {filesCount} / {maxFiles} image{filesCount > 1 ? "s" : ""}{" "}
                    selected
                  </span>
                ) : (
                  <span>Up to {maxFiles} images</span>
                )}
              </Typography>
            )}
          </Box>
        );
      }}
    </Dropzone>
  );
}

export default DropZone;
