import { Box } from "@mui/joy";
import React from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useProduct } from "hooks/product";

function ProductPage() {
  const { path } = useParams();
  const { data, isLoading } = useProduct(path)
  const settings = {
    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    customPaging: function (i) {
      return (
        <a>
          <img src={`${process.env.REACT_APP_API_URL}${data?.images[i].file_path}`} alt="slider" />
        </a>
      )
    }
  };
  console.log(data);
  return (
    <Box
      sx={{
        maxWidth: 1280,
        width: "100%",
        margin: "0 auto",
        paddingBottom: 3,
      }}
    >
      <div className="slider-container"
        style={{
          maxWidth: "358px"
        }}
      >
        <Slider {...settings}>
          {
            data?.images.map(image => (
              <div key={image.id}>
                <img src={`${process.env.REACT_APP_API_URL}${image.file_path}`} alt="slider" />
              </div>
            ))
          }
        </Slider>
      </div>
    </Box>
  );
}

export default ProductPage;
