import {
  ChevronRightRounded,
  HomeRounded,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  FormControl,
  FormLabel,
  Input,
  Link,
  Table,
  Textarea,
  Typography,
} from "@mui/joy";
import ConfirmModal from "components/ConfirmModal";
import React, { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";

function CategoryCreate() {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        fileInputRef.current = file;
        console.log(fileInputRef.current);
        console.log(imagePreview);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      console.log(imagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRounded fontSize="sm" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            href="#some-link"
            aria-label="Home"
          >
            <HomeRounded />
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="#some-link"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="#some-link"
            sx={{ fontSize: 12, fontWeight: 500 }}
          >
            Categories
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Create new category
          </Typography>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Create new category
        </Typography>
      </Box>

      {/* Add create category form */}
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 2,
        }}
      >
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input placeholder="Enter category name" required />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea placeholder="Enter category description" minRows={3} />
        </FormControl>
        <FormControl>
          <FormLabel>Image</FormLabel>
          <Dropzone
            onDrop={onDrop}
            accept="image/*"
            minSize={1024}
            maxSize={3072000}
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

              return (
                <Box
                  sx={{
                    minHeight: 200,
                  }}
                  {...getRootProps({
                    className: `dropzone ${additionalClass}`,
                  })}
                >
                  <input {...getInputProps()} accept="image/*" />

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
        </FormControl>
        {imagePreview && (
          <Table
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: "12px 6px", textAlign: "center" }}>
                  Preview
                </th>
                <th style={{ padding: "12px 6px", textAlign: "center" }}>
                  File name
                </th>
                <th style={{ padding: "12px 6px", textAlign: "center" }}>
                  File size
                </th>
                <th style={{ padding: "12px 6px", textAlign: "center" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: 100, height: 100 }}
                  />
                </td>
                <td>{fileInputRef.current?.name}</td>
                <td>{fileInputRef.current?.size}</td>
                <td>
                  <Button
                    variant="outlined"
                    color="danger"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            color="neutral"
            type="reset"
            onClick={() => {
              setOpen(true);
            }}
          >
            Cancel
          </Button>

          <Button variant="solid" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </Box>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => navigate("/categories")}
        title={"Discard changes?"}
        description={"Your changes will not be saved."}
        cancelText={"Keep editing"}
        confirmText={"Discard"}
      />
    </>
  );
}

export default CategoryCreate;
