import { Box, Stack, Typography, Card } from "@mui/joy";
import React from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProduct } from "hooks/product";
import { Rate } from "antd";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import { PATHS } from "config";

function ProductPage() {
  const { path } = useParams();
  const { data, isLoading } = useProduct(path);
  const [currentOption, setCurrentOption] = React.useState(null);
  const [currentImage, setCurrentImage] = React.useState(null);
  const sliderRef = React.useRef(null);

  React.useEffect(() => {
    if (currentImage !== null && sliderRef.current) {
      sliderRef.current.slickGoTo(data?.images.findIndex((image) => image.file_path === currentImage));
    }
  }, [currentImage, data]);

  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    nextArrow: <ChevronRightRounded />,
    prevArrow: <ChevronLeftRounded />,
    customPaging: function (i) {
      return (
        <a>
          <img
            src={`${process.env.REACT_APP_API_URL}${data?.images[i].file_path}`}
            alt="slider"
          />
        </a>
      );
    },
  };

  const handleChangeOption = (option) => {
    setCurrentOption(option);
    setCurrentImage(option.images[0].file_path);
  };

  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingTop: 3,
        paddingBottom: 3,
      }}
    >
      <Stack
        direction="row"
        gap={1}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography level="title-lg" sx={{ marginRight: "8px" }}>
          {data?.product_name}
        </Typography>
        <Rate
          disabled
          defaultValue={data?.average_rating}
          value={data?.average_rating}
        />
        <Typography level="body-sm">{`(${data?.total_reviews})`}</Typography>
      </Stack>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          marginTop: "16px",
          gap: "16px",
        }}
      >
        <div className="slider-wrapper">
          <div className="slider-container custom-slider">
            <Slider ref={sliderRef} {...settings}>
              {data?.images.map((image) => (
                <div key={image.id}>
                  <img
                    src={`${process.env.REACT_APP_API_URL}${image.file_path}`}
                    alt="slider"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <Stack gap={2}>
          <Stack direction="row" gap={2}>
            {data?.series_products.map((product) => (
              <Link
                key={product.id}
                to={PATHS.PRODUCT.replace(":path", product.slug)}
              >
                <Card
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    width: "150px",
                    height: "60px",
                    border: "2px solid",
                    borderColor: product.id === data.id ? "#0b6bcb" : "#cdd7e1",
                  }}
                >
                  <Typography level="title-sm">
                    {product.specification.storage_capacity}
                  </Typography>
                  <Typography level="body-xs">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(data?.base_price)}
                  </Typography>
                </Card>
              </Link>
            ))}
          </Stack>

          <Typography level="title-sm">Color</Typography>
          <Stack
            direction="row"
            gap={2}
            sx={{
              flexWrap: "wrap",
              maxWidth: "558px",
            }}
          >
            {data?.options.map((option) => (
              <Card
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  width: "175px",
                  height: "60px",
                  border: "2px solid #cdd7e1",
                  padding: "8px",
                  cursor: "pointer",
                  borderColor:
                    currentOption?.id === option.id ? "#0b6bcb" : "#cdd7e1",
                }}
                key={option.id}
                onClick={() => handleChangeOption(option)}
              >
                <Stack
                  direction="row"
                  gap={1}
                  sx={{
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_API_URL}${option.images[0].file_path}`}
                      alt="color"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <Stack>
                    <Typography level="title-sm">{option?.color}</Typography>
                    <Typography level="body-xs">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(option?.price)}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default ProductPage;
