import React from "react";
import { Table, Button, CircularProgress, LinearProgress, Box, Typography } from "@mui/joy";
import { CheckRounded } from "@mui/icons-material";

function PreviewTable({
  upload,
  progress,
  handleRemoveImage,
  uploadedFiles,
  previewFiles,
}) {
  return (
    <Table
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 4,
        textAlign: "center",
        width: "50%",
      }}
    >
      <thead>
        <tr>
          <th style={{ padding: "12px 6px", textAlign: "center" }}>Preview</th>
          <th style={{ padding: "12px 6px", textAlign: "center" }}>
            File size
          </th>
          <th style={{ padding: "12px 6px", textAlign: "center" }}>Status</th>
          <th style={{ padding: "12px 6px", textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {previewFiles?.map((item, index) => {
          return (
            <tr>
              <td>
                <img
                  src={item.preview}
                  alt={item.file.name}
                  style={{ width: "100px" }}
                />
              </td>
              <td>
                {
                  // Display the file size in KB
                  (item.file.size / 1024).toFixed(2) + " KB"
                }
              </td>
              <td>
                {item.progress === 100 ? (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography level="title-sm">Done</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LinearProgress
                      determinate
                      value={item.progress}
                      sx={{ width: "100px" }}
                    />
                  </Box>
                )}
              </td>
              <td>
                <Button
                  variant="soft"
                  color="neutral"
                  onClick={() => handleRemoveImage(
                    item.id
                  )}
                  disabled={item.progress !== 100 && item.progress !== 0}
                >
                  Remove
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default PreviewTable;
