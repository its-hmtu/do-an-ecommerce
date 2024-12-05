import { ChevronRightRounded } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Divider, Link, Typography, FormControl, Tooltip, FormLabel } from "@mui/joy";
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

  const { mutate: upload, isPending } = useMutation({
    mutationFn: (file, progress) => uploadFile(file, progress),
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
      progress: 0, // Initial progress
    }));

    setPreviewFiles((prevFiles) => [...prevFiles, ...filesWithProgress]);

    filesWithProgress.forEach(async (file) => {
      const { file: uploadedFile } = await upload.mutateAsync(file.file, (progress) => {
        const fileIndex = previewFiles.findIndex((f) => f.file === file.file);
        const newFiles = [...previewFiles];
        newFiles[fileIndex] = {
          ...newFiles[fileIndex],
          progress,
        };

        setPreviewFiles(newFiles);
      });

      setUploadedFiles((prevFiles) => [...prevFiles, uploadedFile]);
      // const fileIndex = previewFiles.findIndex((f) => f.file === file.file);
      // const newFiles = [...previewFiles];
      // newFiles[fileIndex] = {
      //   ...newFiles[fileIndex],
      //   progress: 100,
      // };

      // setPreviewFiles(newFiles);
      setIsImagePreview(true);
      setFilesCount((prevCount) => prevCount + 1);
      
    });
  };

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

  const onClickAddMoreVariation = () => setVariations([...variations, {}]);

  const onClickEnableAddVariation = () => {
    setIsAddVariation(true);
    setVariations([{}]);
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
        {/* <BasicInfo
          data={basic}
          categories={categories}
          isImagePreview={isImagePreview}
          uploadedFiles={uploadedFiles}
          filesCount={filesCount}
          previewFiles={previewFiles}
          handleOnChange={handleOnBasicChange}
          handleOnCategoryChange={handleOnSpecsChange}
        /> */}
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
            maxWidth={"25%"}
            filesCount={filesCount}
            maxFiles={6}
          />
        </FormControl>
        {isImagePreview && (
          <PreviewTable
            upload={upload}
            uploadedFiles={uploadedFiles}
            previewFiles={previewFiles}
          />
        )}

        <Divider />

        {/* <SpecsInfo
          brands={brands}
          specsValue={specsValue}
          onClick={handleOnSpecsChange}
        /> */}

        <Divider />

        {/* <SalesInfo
          variations={variations}
          isAddVariation={isAddVariation}
          // uploadedFile={uploadedFile[0]}
          handleCloseVariation={handleCloseVariation}
          onVariationChange={handleOnVariationChange}
          onClickAddMoreVariation={onClickAddMoreVariation}
          onClickEnableAddVariation={onClickEnableAddVariation}
        /> */}

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
