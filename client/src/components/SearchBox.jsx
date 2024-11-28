import React, { useEffect } from "react";
import { Box, Dropdown, Input, Tooltip, Typography } from "@mui/joy";
import SearchIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import { PATHS } from "config";

function SearchBox({ value, onChange, searchData, isLoading, isRefetching }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate()
  return (
    <Tooltip
      arrow
      variant="outlined"
      open={open}
      placement="bottom"
      title={
        <Box sx={{ fontSize: "12px", width: "500px" }}>
          <Typography level="title-sm" sx={{ marginBottom: "8px" }}>
            Search results
          </Typography>
          {isLoading ? (
            <Typography level="body-sm">Loading...</Typography>
          ) : (
            searchData?.products.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px",
                  "& + &": {
                    marginTop: "10px",
                    borderTop: "1px solid #f0f0f0",
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0",
                  },
                  cursor: "pointer",
                }}
                onClick={
                  () => {
                    navigate(`${PATHS.PRODUCT.replace(":path", item.slug)}`)
                  }
                }
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}${
                    item.images.find((image) => image.id === item.main_image_id)
                      .file_path
                  }`}
                  alt={item.product_name}
                  style={{
                    width: "40px",
                    height: "40px",
                  }}
                />
                <Typography level="title-xs">{item.product_name}</Typography>
              </Box>
            ))
          )}
        </Box>
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
          borderRadius: "4px",
          padding: "0 8px",
          height: "36px",
        }}
      >
        <Input
          type="text"
          variant="soft"
          placeholder="What are you looking for?"
          sx={{
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            padding: "0 5px",
            fontSize: "14px",
            flexGrow: 1,
            width: "180px",
          }}
          value={value}
          onChange={onChange}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
            }, 200);
          }}
        />
        <SearchIcon style={{ color: "#888" }} />
      </Box>
    </Tooltip>
  );
}

export default SearchBox;
