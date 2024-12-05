import React from "react";
import { Table, Button, CircularProgress, LinearProgress } from "@mui/joy";

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
          <th style={{ padding: "12px 6px", textAlign: "center" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {previewFiles?.map((file, index) => (
          <tr>
            <td>
              <img
                src={file.preview}
                alt={file.id}
                style={{ width: "100px" }}
              />
            </td>
            <td><LinearProgress
                  determinate
                  value={file.progress}
                  sx={{ width: "100%" }}
                /></td>
            <td>
              
                <Button
                  variant="soft"
                  color="neutral"
                  onClick={() => handleRemoveImage(file.id)}
                >
                  Remove
                </Button>
             
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default PreviewTable;
