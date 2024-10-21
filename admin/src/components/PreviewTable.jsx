import React from "react";
import { Table, Button, CircularProgress, LinearProgress } from "@mui/joy";

function PreviewTable({
  upload,
  progress,
  handleRemoveImage,
  uploadedFile,
  // handleRemoveImage,
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
        <tr>
          <td>
            {upload.isPending ? (
              <CircularProgress />
            ) : (
              <img
                // src={`http://localhost:5000${uploadedFile[0]?.file_path}` || ""}
                alt="Preview"
                style={{ width: 100, height: 100 }}
              />
            )}
          </td>
          {/* <td>{uploadedFile[0]?.file_size}</td> */}
          <td>
            {upload.isPending ? (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ width: "100%" }}
              />
            ) : (
              <Button
                variant="outlined"
                color="danger"
                onClick={handleRemoveImage}
              >
                Remove
              </Button>
            )}
          </td>
          {/* <td>
                  <Button
                    variant="outlined"
                    color="danger"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </td> */}
        </tr>
      </tbody>
    </Table>
  );
}

export default PreviewTable;
