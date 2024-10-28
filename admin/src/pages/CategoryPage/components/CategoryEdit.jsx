import { ChevronRightRounded, HomeRounded } from "@mui/icons-material";
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
import { useQuery } from "@tanstack/react-query";
import { getSingleCategory } from "api/categories.api";
import ConfirmModal from "components/ConfirmModal";
import DropZone from "components/DropZone";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";

function CategoryEdit() {
  const { id } = useParams();
  useEffect(() => {
    console.log("Category ID: ", id);
  }, [id]);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dataValue, setDataValue] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["category", { id }],
    queryFn: () => getSingleCategory({ id }),
  });

  useEffect(() => {
    console.log("Category ID: ", id);
    console.log(data);

    if (data) {
      setDataValue(data);
      setImagePreview(data.images[0].file_path);
      fileInputRef.current = data.images[0];
    }
  }, [data, id]);

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
            {data?.name}
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
          Edit
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
          <Input
            placeholder="Enter category name"
            required
            value={dataValue?.name}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Enter category description"
            minRows={3}
            value={dataValue?.description}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Cover Image</FormLabel>
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
                  <td>{fileInputRef.current?.name || "-" }</td>
                  <td>{fileInputRef.current?.size || "-" }</td>
                  <td>
                    <Box
                      sx={{
                        gap: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button variant="outlined">
                        Change
                      </Button>
                      <Button
                        variant="outlined"
                        color="danger"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </Button>
                    </Box>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </FormControl>
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
            Save
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

export default CategoryEdit;
