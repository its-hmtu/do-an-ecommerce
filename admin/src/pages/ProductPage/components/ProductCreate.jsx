import { AddRounded, ChevronRightRounded, HomeRounded } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  Input,
  LinearProgress,
  Link,
  Option,
  Select,
  Stack,
  Table,
  Textarea,
  Typography,
} from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands } from "api/brands.api";
import { createCategory } from "api/categories.api";
import {uploadFile, removeImage} from "api/upload.api";
import ConfirmModal from "components/ConfirmModal";
import DropZone from "components/DropZone";
import PreviewTable from "components/PreviewTable";
import { ToastMessageContext } from "contexts/ToastMessageContext";
import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCreate() {
  const [imagePreview, setImagePreview] = useState("");
  const formData = new FormData();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { toastMessage, setToastMessage } =
    React.useContext(ToastMessageContext);
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const {data: brands, isLoading: brandsLoading} = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
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

  const upload = useMutation({
    mutationFn: (file) => uploadFile(file, setProgress),
    onSuccess: (data) => {
      setToastMessage({
        message: "Image uploaded successfully",
        type: "success",
        open: true,
      });

      setUploadedFile(data.data);
      console.log(uploadedFile[0]);
    },
  });

  const removeImage = useMutation({

  })

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
      reader.readAsDataURL(file);

      reader.onload = () => {
        setImagePreview(reader.result);
      };

      reader.onerror = () => {
        console.error("Error reading file");
      };

      upload.mutate(file);
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
            Create product
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
          Create product
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
        <Stack
          gap={2}
          sx={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "16px",
          }}
        >
          <Typography level="h4" component="h2">
            Basic Information
          </Typography>
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
            <FormLabel>Product images</FormLabel>
            <DropZone onDrop={onDrop} />
          </FormControl>
          <PreviewTable
            upload={upload}
            progress={progress}
            handleRemoveImage={handleRemoveImage}
            uploadedFile={uploadedFile}
          />
          </Stack>

          <Stack
            gap={2}
          >
            <Typography level="h4" component="h2">
              Detail Information
            </Typography>
            <FormControl>
              <FormLabel>Brand</FormLabel>
              {/* Brand selector */}
              <Select placeholder="Select brand"
                sx={{
                  width: "25%",
                  maxHeight: "200px"
                }}
              >
                <Option value="">
                  Select brand
                </Option>
                <Stack>
                {
                  brands?.map((brand) => (
                    <Option key={brand.id} value={brand.id}>
                      {brand.name}
                    </Option>
                  ))
                }
                </Stack>
                <Button variant="plain" color="primary"
                  endDecorator={<AddRounded />}
                  sx={{
                    textAlign: "left",
                  }}
                >
                  Add new brand
                </Button>
              </Select>

            </FormControl>

          </Stack>

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
            disabled={mutate.isLoading || Object.values(data).some((v) => !v)}
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
