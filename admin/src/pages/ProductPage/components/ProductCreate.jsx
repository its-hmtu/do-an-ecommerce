import { ChevronRightRounded } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Divider, Link, Typography } from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands } from "api/brands.api";
import { createCategory, getAllCategories } from "api/categories.api";
import { uploadFile, removeImage, uploadSingleFile } from "api/upload.api";
import ConfirmModal from "components/ConfirmModal";
import { ToastMessageContext } from "contexts/ToastMessageContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import SalesInfo from "./SalesInfo";
import SpecsInfo from "./SpecsInfo";
import { toast } from "react-toastify";
import { createProduct } from "api/products.api";

function ProductCreate() {
  const [isImagePreview, setIsImagePreview] = useState(false);
  const navigate = useNavigate();
  const [submitData, setSubmitData] = useState({});
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState({});
  const [isAddVariation, setIsAddVariation] = useState(false);
  const [filesCount, setFilesCount] = useState(0);
  const [isCoverImageSet, setIsCoverImageSet] = useState(false);
  const [variations, setVariations] = useState([
    {
      name: "",
      price: 0,
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
    category: [],
  });

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const mutate = useMutation({
    mutationFn: (data) => createProduct(data),
    onSuccess: () => {
      toast.success("Product created successfully!");
      navigate("/products", { replace: true });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    }
  });

  const upload = useMutation({
    mutationFn: (files) => uploadFile(files, setProgress),
    onSuccess: (data) => {
      toast.success("Upload successfully!");
      setUploadedFiles((prevFiles) => [...prevFiles, ...data]);
      // console.log(data);
    },
  });

  const uploadSingle = useMutation({
    mutationFn: (file) => uploadSingleFile(file, setProgress),
    onSuccess: (data) => {
      toast.success("Upload successfully!");
      setUploadedFile(data[0]);
      // console.log(data[0]);
    },
  });

  const remove = useMutation({
    mutationFn: (id) => removeImage(id)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validate();

    if (!validation) return;

    else {
      const options = variations.map((variation) => ({
        color: variation.name,
        price: variation.price,
        stock: variation.stock,
        image_id: variation.image?.id,
      }))
  
      const product_images_ids = uploadedFiles.map((file) => file.id);
      const newSubmitData = {
        product_name: basic.name,
        product_description: basic.description,
        category_ids: basic.category,
        options,
        specs: specsValue,
        product_images_ids,
      }
      setSubmitData(newSubmitData);
      mutate.mutate(newSubmitData);

    }
  };

  useEffect(() => {
    console.log(variations);
  }, [variations]);

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

    console.log(basic);
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

  const onDropMultiple = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles;
      console.log(files);

      if (files.length > 6) {
        toast.error("You can only upload up to 6 images");
        return;
      }

      setFilesCount((prevCount) => prevCount + files.length);
      setIsCoverImageSet(true);
      upload.mutate(files);

      setIsImagePreview(true);
    },
    [upload]
  );

  const onDropSingle = useCallback(
    (acceptedFiles, variationIndex) => {
      const file = acceptedFiles[0];

      if (file) {
        uploadSingle.mutate(file, {
          onSuccess: (data) => {
            setVariations((prevVariations) =>
              prevVariations.map((variation, index) =>
                index === variationIndex
                  ? { ...variation, image: data[0] }
                  : variation
              )
            );
            console.log(variations);
          },
        });
      }
    },
    [uploadSingle, variations]
  );

  const handleRemoveImage = (id) => {
    remove.mutate(id);

    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    setFilesCount((prevCount) => prevCount - 1);


    if (filesCount === 1) {
      setIsImagePreview(false);
    } else if (filesCount === 0) {
      setIsCoverImageSet(false);
    }
  };

  const handleRemoveSingleImage = (id, variationIndex) => {
    remove.mutate(id, {
      onSuccess: () => {
        setVariations((prevVariations) =>
          prevVariations.map((variation, index) =>
            index === variationIndex ? { ...variation, image: null } : variation
          )
        );
      },
    });
  };

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
  }

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
        <BasicInfo
          data={basic}
          categories={categories}
          isImagePreview={isImagePreview}
          upload={upload}
          progress={progress}
          uploadedFiles={uploadedFiles}
          filesCount={filesCount}
          // coverImageCount={coverImageCount}
          handleOnChange={handleOnBasicChange}
          handleOnCategoryChange={handleOnSpecsChange}
          onDrop={onDropMultiple}
          handleRemoveImage={handleRemoveImage}
        />

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
          // uploadedFile={uploadedFile[0]}
          handleCloseVariation={handleCloseVariation}
          handleRemoveImage={handleRemoveSingleImage}
          onVariationChange={handleOnVariationChange}
          onClickAddMoreVariation={onClickAddMoreVariation}
          onClickEnableAddVariation={onClickEnableAddVariation}
          onDrop={onDropSingle}
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
          <Button
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
