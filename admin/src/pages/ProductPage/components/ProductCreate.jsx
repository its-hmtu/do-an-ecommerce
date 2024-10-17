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
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "api/categories.api";
import ConfirmModal from "components/ConfirmModal";
import DropZone from "components/DropZone";
import { ToastMessageContext } from "contexts/ToastMessageContext";
import React, { useCallback, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";

function ProductCreate() {
  const [imagePreview, setImagePreview] = useState(null);
  const formData = new FormData();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { toastMessage, setToastMessage } =
    React.useContext(ToastMessageContext);
  const [data, setData] = useState({
    name: "",
    description: "",
    images: [],
  });

  const mutate = useMutation({
    mutationFn: (formData) => createCategory(formData),
    onSuccess: () => {
      setToastMessage({
        message: "Category created successfully",
        type: "success",
        open: true,
      });
      navigate("/categories");
    },
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("images", data.images[0]);
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    mutate.mutate(formData);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        fileInputRef.current = file;
        console.log(fileInputRef.current);
        console.log(imagePreview);
      };
      reader.readAsDataURL(file);

      setData((prevData) => ({
        ...prevData,
        images: [...prevData.images, file],
      }));
    } else {
      setImagePreview(null);
    }
  }, []);

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
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            color="neutral"
            sx={{ fontSize: 12, fontWeight: 500 }}
            onClick={() => setOpen(true)}
          >
            Products
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Create new product
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
          Create new product
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
            name="name"
            value={data.name}
            onChange={handleOnChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Enter category description"
            minRows={3}
            name="description"
            value={data.description}
            onChange={handleOnChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Base price</FormLabel>
          <Input 
            type="number" 
            placeholder="Enter base price" 
            required
            name="base_price"
            value={data.base_price}
            onChange={handleOnChange}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Cover Image</FormLabel>
          {!imagePreview && <DropZone onDrop={onDrop} />}
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
          <Button
            variant="solid"
            color="primary"
            type="submit"
            disabled={mutate.isLoading}
            onClick={handleSubmit}
          >
            {mutate.isLoading ? "Creating..." : "Create"}
          </Button>
        </Box>
      </Box>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => navigate("/products")}
        title={"Discard changes?"}
        description={"Your changes will not be saved."}
        cancelText={"Keep editing"}
        confirmText={"Discard"}
      />
    </>
  );
}

export default ProductCreate;
