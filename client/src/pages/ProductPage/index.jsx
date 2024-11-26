import {
  Box,
  Stack,
  Typography,
  Card,
  Button,
  Divider,
  Table,
  LinearProgress,
  Avatar,
} from "@mui/joy";
import React, { useContext } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProduct } from "hooks/product";
import { Progress, Rate } from "antd";
import {
  AddShoppingCartRounded,
  ChevronLeftRounded,
  ChevronRightRounded,
  LocalShippingOutlined,
  RefreshRounded,
} from "@mui/icons-material";
import { PATHS } from "config";
import ProductCard from "components/ProductCard";
import PostReviewModal from "components/Modal/PostReviewModal";
import { UserContext } from "contexts/UserContext";
import ReviewCard from "./components/ReviewCard";
import SpecificationCard from "./components/SpecificationCard";
import DescriptionCard from "./components/DescriptionCard";

function ProductPage() {
  const { path } = useParams();
  const { data, isLoading } = useProduct(path);
  const [currentOption, setCurrentOption] = React.useState(data?.options[0]);
  const [currentImage, setCurrentImage] = React.useState(null);
  const [openDescription, setOpenDescription] = React.useState(false);
  const [openPostReview, setOpenPostReview] = React.useState(false);
  const {user} = useContext(UserContext);
  const sliderRef = React.useRef(null);
  const navigate = useNavigate();
  React.useEffect(() => {
    if (currentImage !== null && sliderRef.current) {
      sliderRef.current.slickGoTo(
        data?.images.findIndex((image) => image.file_path === currentImage)
      );
    }
  }, [currentImage, data]);

  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    nextArrow: <ChevronRightRounded />,
    prevArrow: <ChevronLeftRounded />,
    customPaging: function (i) {
      if (!data?.images || !data.images[i]) {
        return (
          <a> </a>
        ); // Render nothing if data is incomplete
      }
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

  if (isLoading 
    || !data
  ) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          height: "100vh",
          // maxWidth: 1280,
        }}
      >
        <LinearProgress />
      </Box>
    )
  }

  return (
    <>
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
          <Typography level="h3" sx={{ marginRight: "8px" }}>
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
            marginBottom: "32px",
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

          <Stack gap={2} sx={{ width: "558px" }}>
            <Stack direction="row" gap={2}>
              {data?.series_products.map((product) => (
                <Link
                  key={product.id}
                  to={PATHS.PRODUCT.replace(":path", product.slug)}
                >
                  <Button
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "4px",
                      width: "150px",
                      height: "60px",
                      border: "2px solid",
                      borderColor:
                        product.id === data.id ? "#0b6bcb" : "#cdd7e1",
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    variant="outlined"
                    color="neutral"
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
                  </Button>
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
                <Button
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
                    backgroundColor: "#fff",
                  }}
                  key={option.id}
                  onClick={() => handleChangeOption(option)}
                  variant="outlined"
                  disabled={option.stock === 0}
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
                    {data && (
                      <Stack
                        sx={{
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography level="title-sm">
                          {option?.color}
                        </Typography>
                        <Typography level="body-xs">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(option?.price)}
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                </Button>
              ))}
            </Stack>

            <Stack
              direction="row"
              gap={2}
              sx={{
                alignItems: "center",
                marginTop: "26px",
              }}
            >
              <Typography
                level="h3"
                sx={{
                  color: "rgb(219, 68, 68)",
                }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  currentOption ? currentOption?.price : data?.base_price
                )}
              </Typography>
              <Typography
                level="body-sm"
                sx={{
                  textDecoration: "line-through",
                }}
              >
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  currentOption ? currentOption?.price : data?.base_price
                )}
              </Typography>
            </Stack>

            <Stack direction="row" gap={2}>
              <Button
                sx={{
                  textTransform: "uppercase",
                  width: "100%",
                  padding: "24px",
                }}
              >
                Buy now
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                sx={{
                  width: "150px",
                  backgroundColor: "#fff",
                }}
              >
                <Stack
                  sx={{
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <AddShoppingCartRounded />
                  Add to cart
                </Stack>
              </Button>
            </Stack>

            <Card
              sx={{
                backgroundColor: "#fff",
              }}
            >
              <Stack
                gap={2}
                direction="row"
                sx={{
                  alignItems: "center",
                }}
              >
                <LocalShippingOutlined
                  sx={{
                    fontSize: "40px",
                  }}
                />
                <Stack gap={1}>
                  <Typography level="title-lg">Free Delivery</Typography>
                  <Typography level="body-sm">
                    Enter your postal code for Delivery Availability
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <Stack
                gap={2}
                direction="row"
                sx={{
                  alignItems: "center",
                }}
              >
                <RefreshRounded
                  sx={{
                    fontSize: "40px",
                  }}
                />
                <Stack gap={1}>
                  <Typography level="title-lg">Return Delivery</Typography>
                  <Typography level="body-sm">
                    Free 30 Days Delivery Returns. <Link to="#">Details.</Link>
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Box>
        <Divider />
        <Stack gap={2} sx={{ marginTop: "32px" }}>
          {data?.related_products.length > 0 && (
            <>
              <Typography level="title-lg">Related products</Typography>
              <Stack
                direction="row"
                gap={3}
                sx={{ mt: 1, justifyContent: "flex-start", flexWrap: "wrap" }}
              >
                {data?.related_products.map((product) => {
                  return (
                    <ProductCard
                      key={product.id}
                      data={product}
                      showTotalReviews={false}
                    />
                  );
                })}
              </Stack>
            </>
          )}

          <Stack direction="row" gap={2}>
            <Box
              sx={{
                width: "calc(100% - 338px)",
              }}
            >
              <DescriptionCard data={data} openDescription={openDescription} setOpenDescription={setOpenDescription} />
              <Stack
                gap={2}
                sx={{
                  marginTop: "16px",
                  padding: "16px",
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography level="title-lg">
                  Reviews & rating {data?.product_name}
                </Typography>
                <Stack
                  gap={2}
                  direction="row"
                  sx={{
                    padding: "16px",
                  }}
                >
                  <Stack
                    gap={1}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "250px",
                    }}
                  >
                    <Typography level="h4">
                      {`${data?.average_rating} / 5`}
                    </Typography>
                    <Rate
                      disabled
                      defaultValue={0}
                      value={data?.average_rating}
                    />
                    <Typography level="body-sm">{`${data?.total_reviews} reviews`}</Typography>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack
                    gap={2}
                    sx={{
                      width: "100%",
                    }}
                  >
                    {Array.from({ length: 5 })
                      .reverse()
                      .map((_, index) => (
                        <Stack direction="row" key={index} gap={1}>
                          <Typography level="body-sm">{index + 1}</Typography>
                          <Rate disabled defaultValue={0} value={1} count={1} />
                          <Progress
                            showInfo={false}
                            style={{
                              maxWidth: "500px",
                            }}
                            percent={
                              (data?.reviews.filter(
                                (review) => review.rating === index + 1
                              ).length /
                                data?.total_reviews) *
                              100
                            }
                          />
                          <Typography level="body-sm">{`${
                            data?.reviews.filter(
                              (review) => review.rating === index + 1
                            ).length
                          } reviews`}</Typography>
                        </Stack>
                      ))}
                  </Stack>
                </Stack>
                <Divider />
                <Stack
                  gap={2}
                  sx={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "16px",
                  }}
                >
                  <Typography level="body-lg">
                    What do you think about this product?
                  </Typography>
                  <Button
                    sx={{
                      width: "200px",
                      padding: "16px",
                      fontSize: "16px",
                    }}
                    onClick={() => setOpenPostReview(true)}
                  >
                    Review this product
                  </Button>
                </Stack>
                {data?.reviews.length > 0 && <Divider />}
                {data?.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} user={user} />
                ))}
              </Stack>
            </Box>
            <SpecificationCard data={data} />
          </Stack>
        </Stack>
      </Box>
      {openPostReview && (
        <PostReviewModal
          open={openPostReview}
          onCancel={() => setOpenPostReview(false)}
          title={data?.product_name}
          confirmText={"Submit review"}
          productId={data?.id}
        />
      )}
    </>
  );
}

export default ProductPage;
