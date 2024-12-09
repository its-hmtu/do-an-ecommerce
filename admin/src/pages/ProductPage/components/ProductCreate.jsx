import { ChevronRightRounded } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
  FormControl,
  Tooltip,
  FormLabel,
  Stack,
} from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands } from "api/brands.api";
import { createCategory, getAllCategories } from "api/categories.api";
import { uploadFile, removeImage, uploadSingleFile } from "api/upload.api";
import ConfirmModal from "components/ConfirmModal";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import SalesInfo from "./SalesInfo";
import SpecsInfo from "./SpecsInfo";
import { toast } from "react-toastify";
import { createProduct } from "api/products.api";
import DropZone from "components/DropZone";
import PreviewTable from "components/PreviewTable";
import { set } from "date-fns";
import BreadCrumbs from "components/BreadCrumbs";

function ProductCreate() {
  const [isImagePreview, setIsImagePreview] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [isAddVariation, setIsAddVariation] = useState(false);
  const [filesCount, setFilesCount] = useState(0);
  const [isCoverImageSet, setIsCoverImageSet] = useState(false);
  const [variations, setVariations] = useState([
    {
      name: "",
      price: 0,
      special_price: 0,
      stock: 0,
      image: null,
    },
  ]);
  const [specsValue, setSpecsValue] = useState({
    brand: "",
    storage_capacity: "",
    number_of_cameras: "",
    camera_resolution: "",
    battery_capacity: "",
    processor: "",
    dimensions: "",
    ram: "",
    rom: "",
    screen_size: "",
    operating_system: "",
    cable_type: "",
    sim_type: "",
    manufacture_date: "",
    warranty_duration: "",
    condition: "",
    phone_model: "",
  });
  const [basic, setBasic] = useState({
    name: "",
    description: "",
    category: "",
  });

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const {
    mutate: upload,
    mutateAsync: uploadAsync,
    isPending,
  } = useMutation({
    mutationFn: ({ file, progress = () => {} }) => uploadFile(file, progress),
  });

  const validate = () => {
    if (Object.values(basic).some((v) => !v)) {
      // toast.error("Please fill in all required fields");
      return false;
    } else if (!specsValue.brand) {
      // toast.error("Please select a brand");
      return false;
    } else if (Object.values(variations).some((v) => !v.price || !v.stock)) {
      // toast.error("Please fill in all color fields");
      return false;
    } else if (filesCount < 1 || !isCoverImageSet) {
      // toast.error("Please upload at least 1 image");
      return false;
    }

    return true;
  };

  const handleUploadFile = async (acceptedFiles) => {
    const filesWithProgress = Array.from(acceptedFiles).map((file) => ({
      file,
      id: `${file.name}-${file.size}-${Date.now()}`,
      progress: 0, // Initial progress
      uploaded: false, // Upload status
      preview: URL.createObjectURL(file), // Generate preview
    }));

    // Add new files to the current state
    setPreviewFiles((prevFiles) => [...prevFiles, ...filesWithProgress]);
    setFilesCount((prevCount) => prevCount + filesWithProgress.length);
    setIsImagePreview(true);
    // Upload all files concurrently
    const uploadPromises = filesWithProgress.map((currentFile) =>
      uploadFile(currentFile.file, (progress) => {
        setPreviewFiles((prev) =>
          prev.map((item) =>
            item.file === currentFile.file ? { ...item, progress } : item
          )
        );
      }).then((data) => {
        // Mark file as uploaded after completion
        setPreviewFiles((prev) =>
          prev.map((item) =>
            item.file === currentFile.file ? { ...item, uploaded: true } : item
          )
        );

        setUploadedFiles((prev) => [
          ...prev,
          {
            id: currentFile.id,
            data: data[0],
          },
        ]);
      })
    );

    // Wait for all uploads to finish
    await Promise.all(uploadPromises);
  };

  const handleRemoveImage = (id = "") => {
    if (!id) return;

    setPreviewFiles((prev) => prev.filter((item) => item.id !== id));
    setUploadedFiles((prev) => prev.filter((item) => item.id !== id));
    setFilesCount((prev) => prev - 1);
    if (previewFiles.length === 1) {
      setIsImagePreview(false);
    }
  };

  useEffect(() => {
    console.log("previewFiles", previewFiles);
    console.log("uploadedFiles", uploadedFiles);
  }, [previewFiles, uploadedFiles]);

  const handleOnSpecsChange = (value, key) => {
    setSpecsValue((prevValue) => ({
      ...prevValue,
      [key]: value,
    }));

    if (key === "category") {
      setBasic((prevBasic) => ({
        ...prevBasic,
        category: value,
      }));
    }
  };

  const handleOnBasicChange = (e) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    setBasic((prevBasic) => ({
      ...prevBasic,
      [name]: value,
    }));
  };

  const handleCloseVariation = (variationIndex) => {
    setVariations(variations?.filter((_, i) => i !== variationIndex));

    if (variations?.length === 1) {
      setIsAddVariation(false);
    }
  };

  const handleOnVariationChange = (e, variationIndex) => {
    const { name, value } = e.target;
    setVariations((prevVariations) => {
      const newVariations = [...prevVariations];
      newVariations[variationIndex] = {
        ...newVariations[variationIndex],
        [name]: value,
      };

      return newVariations;
    });
  };

  const handleVariationUpload = async (files, variationIndex) => {
    uploadFile(files[0], (progress) => {
      setVariations((prevVariations) => {
        const newVariations = [...prevVariations];
        newVariations[variationIndex] = {
          ...newVariations[variationIndex],
          image: {
            preview: URL.createObjectURL(files[0]),
          },
          progress,
        };

        return newVariations;
      });
    }).then((data) => {
      setVariations((prevVariations) => {
        const newVariations = [...prevVariations];
        newVariations[variationIndex] = {
          ...newVariations[variationIndex],
          image: {
            ...newVariations[variationIndex].image,
            data: data[0],
          },
        };

        return newVariations;
      });
    })
  }

  const handleVariationRemove = (variationIndex) => {
    setVariations((prevVariations) => {
      const newVariations = [...prevVariations];
      newVariations[variationIndex] = {
        ...newVariations[variationIndex],
        image: null,
      };

      return newVariations;
    });
  }

  const onClickAddMoreVariation = () => setVariations([...variations, {}]);

  const onClickEnableAddVariation = () => {
    setIsAddVariation(true);
    setVariations([{}]);
  };

  useEffect(() => {
    console.log("variations", variations);
  }, [variations]);

  return (
    <>
      <BreadCrumbs
        links={[
          { label: "Dashboard", onClick: () => navigate("/dashboard") },
          { label: "Products", onClick: () => setOpen(true) },
        ]}
        nonLinkLabel={"Create product"}
      />
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
        <BasicInfo
          data={basic}
          categories={categories}
          handleOnChange={handleOnBasicChange}
          handleOnCategoryChange={handleOnSpecsChange}
        />
        <FormControl>
          <Tooltip
            arrow
            title="Required - Select at least 1 image"
            placement="top"
            color="neutral"
            variant="outlined"
          >
            <FormLabel>
              Product images
              <Typography color="danger">*</Typography>
            </FormLabel>
          </Tooltip>
          <DropZone
            onDrop={handleUploadFile}
            maxWidth={"100%"}
            filesCount={filesCount}
            maxFiles={6}
            disabled={filesCount >= 6}
          />
        </FormControl>
        {isImagePreview && (
          <Stack direction="row" gap={2}>
            <div style={{
              width: "60%"
            }}>
              <PreviewTable
                upload={upload}
                uploadedFiles={uploadedFiles}
                previewFiles={previewFiles}
                handleRemoveImage={handleRemoveImage}
              />
            </div>
            <ul style={{
              width: "40%"
            }}>
              <li>
                <Typography level="body-sm">
                  The first image will be set as the cover image
                </Typography>
              </li>
            </ul>
          </Stack>
        )}

        <Divider />

        <SpecsInfo
          brands={brands}
          specsValue={specsValue}
          onClick={handleOnSpecsChange}
        />

        <Divider />

        <SalesInfo
          variations={variations}
          isAddVariation={isAddVariation}
          handleCloseVariation={handleCloseVariation}
          onVariationChange={handleOnVariationChange}
          onClickAddMoreVariation={onClickAddMoreVariation}
          onClickEnableAddVariation={onClickEnableAddVariation}
          onDrop={handleVariationUpload}
          handleRemoveImage={handleVariationRemove}
        />

        <Divider />

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 2,
            paddingBlock: "1rem",
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
          {/* <Button
            variant="solid"
            color="primary"
            type="submit"
            disabled={!validate() || mutate.isPending}
            onClick={handleSubmit}
            loading={mutate.isPending}
            loadingPosition="start"
            sx={{
              ".MuiCircularProgress-progress": {
                stroke: "var(--CircularProgress-progressColor)!important",
              },
            }}
          >
            {mutate.isPending ? "Creating..." : "Create"}
          </Button> */}
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
