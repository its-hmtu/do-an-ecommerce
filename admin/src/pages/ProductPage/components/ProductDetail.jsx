import { ChevronRightRounded } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Divider, Link, Typography } from "@mui/joy";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getBrands } from "api/brands.api";
import { createCategory, getAllCategories } from "api/categories.api";
import { uploadFile, removeImage, uploadSingleFile } from "api/upload.api";
import ConfirmModal from "components/ConfirmModal";
import { ToastMessageContext } from "contexts/ToastMessageContext";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import SalesInfo from "./SalesInfo";
import SpecsInfo from "./SpecsInfo";
import { toast } from "react-toastify";
import { createProduct, getSingleProduct, updateProduct } from "api/products.api";
import AddNewModal from "components/AddNewModal";

function ProductDetail() {
  const { id } = useParams();
  const [isImagePreview, setIsImagePreview] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [submitData, setSubmitData] = useState({});
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadedFile, setUploadedFile] = useState({});
  const [isAddVariation, setIsAddVariation] = useState(false);
  const [filesCount, setFilesCount] = useState(0);
  const [coverImageCount, setCoverImageCount] = useState(0);
  const [toBeRemovedImages, setToBeRemovedImages] = useState([]);
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

  const [originalData, setOriginalData] = useState({})

  const { data: brands, isLoading: brandsLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const getProduct = useQuery({
    queryKey: ["product", id],
    queryFn: () => getSingleProduct({ id }),
    refetchOnWindowFocus: false,
  })

  useEffect(( ) => {
    console.log("basic", basic);
    console.log("specsValue", specsValue);
    console.log("original",originalData)
  })

  useEffect(() => {
    if (getProduct.isSuccess) {
      const { product_name, product_description, categories, options, specification, images } = getProduct?.data;
      setBasic({
        name: product_name,
        description: product_description,
        category: categories[0]?.id,
      });

      if (options?.length >= 1) {
        setIsAddVariation(true);
      } else if (options?.length === 1 && options[0].color === "") {
        setIsAddVariation(false);
      }

      setVariations(options?.map(({ color, price, special_price, stock, images }) => ({
        name: color,
        price,
        special_price,
        stock,
        image: images[0],
      })));

      console.log(options)

      setSpecsValue({
        ...specification,
        brand: specification.brand_id,
        manufacture_date: 
          new Date(specification.manufacture_date).toISOString().split("T")[0]
        , // format date to yyyy-mm-dd
        number_of_cameras: specification?.number_of_cameras?.toString(),
      });

      setUploadedFiles(images);
      setFilesCount(images.length);
      if (images.length > 0) {
        setIsImagePreview(true);
      }

      setOriginalData({
        ...getProduct.data
      })

      console.log(getProduct.data);
    }
  }, [getProduct.data, getProduct.isSuccess]);

  const mutate = useMutation({
    mutationFn: ({id, data}) => updateProduct({id, data}),
    onSuccess: () => {
      navigate("/products");
    },
  });

  useEffect(() => {
    console.log("specValue", specsValue);
  }, [specsValue]);

  const upload = useMutation({
    mutationFn: (files) => uploadFile(files, setProgress),
    onSuccess: (data) => {
      toast.success("Upload successfully");
      setUploadedFiles((prevFiles) => [...prevFiles, ...data]);
      console.log(data);
    },
  });

  const uploadSingle = useMutation({
    mutationFn: (file) => uploadSingleFile(file, setProgress),
    onSuccess: (data) => {
      toast.success("Upload successfully");
      setUploadedFile(data[0]);
      console.log(data[0]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const options = variations.map((variation) => ({
      color: variation.name,
      price: variation.price,
      special_price: variation.special_price,
      stock: variation.stock,
      image_id: variation.image?.id,
    }));

    const product_images_ids = uploadedFiles.map((file) => file.id);
    const newSubmitData = {
      product_name: basic.name,
      product_description: basic.description,
      category_id: basic.category,
      options,
      specs: specsValue,
      product_images_ids,
    }

    setSubmitData(newSubmitData);

    mutate.mutate({id, data: newSubmitData}, {
      onSuccess: () => {
        toast.success("Product updated successfully");
      },
    });
  };

  useEffect(() => {
    console.log("submitData", submitData);
  }, [submitData]);

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
    // remove.mutate(id);
    const image = uploadedFiles.find((file) => file.id === id);
    setUploadedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    setFilesCount((prevCount) => prevCount - 1);
    setToBeRemovedImages((prevImages) => [...prevImages, image]);

    if (filesCount === 1) {
      setIsImagePreview(false);
    }
  };

  const handleRemoveSingleImage = (id, variationIndex) => {
    setVariations((prevVariations) => 
      prevVariations.map((variation, index) => 
        index === variationIndex ? { ...variation, image: null } : variation
      )
    )

    const image = variations[variationIndex].image;

    setToBeRemovedImages((prevImages) => [...prevImages, {
      ...image,
      variationIndex,
    }]);

    // remove.mutate(id, {
    //   onSuccess: () => {
    //     setVariations((prevVariations) =>
    //       prevVariations.map((variation, index) =>
    //         index === variationIndex ? { ...variation, image: null } : variation
    //       )
    //     );
    //   },
    // });
  };

  useEffect(() => {
    console.log(variations);
  })

  const handleOnConfirm = () => {
    // revert back to the original data
    // setBasic({
    //   name: originalData.product_name,
    //   description: originalData.product_description,
    //   category: originalData?.categorires.map(({id}) => id),
    // })

    // if (originalData.options.length >= 1) {
    //   setIsAddVariation(true);
    // } else if (originalData.options.length === 1 && originalData.options[0].color === "") {
    //   setIsAddVariation(false);
    // }

    // setVariations(originalData.options.map(({ color, price, stock, images }) => ({
    //   name: color,
    //   price,
    //   stock,
    //   image: images[0],
    // })));

    // setSpecsValue({
    //   ...originalData.specification,
    //   brand: originalData.specification.brand_id,
    //   manufacture_date: 
    //     new Date(originalData.specification.manufacture_date).toISOString().split("T")[0]
    //   , // format date to yyyy-mm-dd
    // });

    // setUploadedFiles(originalData.images);
    // setFilesCount(originalData.images.length);
    // setIsImagePreview(true);

    const options = originalData?.options.map(({ color, price, special_price, stock, images }) => ({
      color,
      price,
      special_price,
      stock,
      image_id: images[0]?.id,
    }));
    const data = {
      product_name: originalData.product_name,
      product_description: originalData.product_description,
      category_ids: originalData?.categories.map(({id}) => id),
      options: options,
      specs: {
        ...originalData.specification,
        brand: originalData.specification.brand_id,
        manufacture_date: 
          new Date(originalData.specification.manufacture_date).toISOString().split("T")[0]
        , // format date to yyyy-mm-dd
      },
      product_images_ids: originalData.images.map(({id}) => id),
    }

    setOpen(false);

    mutate.mutate({id, data});
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
            Product Details
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
          Product Details
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
          coverImageCount={coverImageCount}
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
            disabled={mutate.isLoading}
            onClick={handleSubmit}
          >
            {mutate.isLoading ? "Update..." : "Update"}
          </Button>
        </Box>
      </Box>

      <ConfirmModal
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleOnConfirm}
        title={"Discard changes?"}
        description={"Your changes will not be saved."}
        cancelText={"Keep editing"}
        confirmText={"Discard"}
      />
    </>
  );
}

export default ProductDetail;
