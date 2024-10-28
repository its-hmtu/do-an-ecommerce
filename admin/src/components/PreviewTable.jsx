import React from "react";
import { Table, Button, CircularProgress, LinearProgress } from "@mui/joy";

function PreviewTable({
  upload,
  progress,
  handleRemoveImage,
  uploadedFiles,
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
          <th style={{ padding: "12px 6px", textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {uploadedFiles?.map((file) => (
          <tr>
            <td>
              { upload.isPending ? (
                <CircularProgress />
              ) : (
                <img
                src={`${process.env.REACT_APP_API_URL}${file.file_path}`}
                alt={file.original_name}
                style={{ width: "100px" }}
              />
              )}
            </td>
            <td>
              {
                upload.isPending ? (
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ width: "100%" }}
                  />
                ) : (
                  (file.file_size / 1024).toFixed(2) + " KB"
                )
              }
            </td>
            <td>
              {upload.isPending ? (
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ width: "100%" }}
                />
              ) : (
                <Button
                  variant="soft"
                  color="neutral"
                  onClick={() => handleRemoveImage(file.id)}
                >
                  Remove
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PreviewTable;
