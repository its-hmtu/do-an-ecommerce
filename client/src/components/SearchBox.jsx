import React, { useEffect } from "react";
import { Box, Dropdown, Input, Tooltip, Typography } from "@mui/joy";
import SearchIcon from "@mui/icons-material/SearchRounded";
import { useNavigate } from "react-router-dom";
import { PATHS } from "config";

function SearchBox({ value, onChange, searchData, isLoading, isRefetching }) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <Tooltip
      arrow
      variant="outlined"
      open={open && value}
      placement="bottom"
      sx={{
        backgroundColor: "#fff",
        padding: 0,
      }}
      title={
        <Box
          sx={{
            fontSize: "12px",
            width: "500px",
            height: "300px",
            overflowY: "auto",
            backgroundColor: "#fff",
            padding: "10px",
            paddingTop: "0",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            position: "relative",
          }}
        >
          <Typography
            level="title-sm"
            sx={{ marginBottom: "8px", position: "sticky", top: 0, padding: "10px", backgroundColor: "#fff", zIndex: 1 }}
          >
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
                  borderRadius: "8px",
                }}
                onClick={() => {
                  navigate(`${PATHS.PRODUCT.replace(":path", item.slug)}`);
                }}
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
      <Input
        type="text"
        variant="soft"
        placeholder={open ? "What are you looking for?" : "Search"}
        sx={{
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          padding: "0 5px",
          fontSize: "14px",
          flexGrow: 1,
          width: open ? "250px" : "175px",
          background: "#f0f0f0",
          transition: "width 0.3s ease",
        }}
        value={value}
        onChange={onChange}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
          }, 200);
        }}
        onKeyDown={
          (e) => {
            if (e.key === "Enter") {
              navigate(PATHS.SEARCH_RESULTS, { state: { value } });
            }
          }
        }
        endDecorator={<SearchIcon style={{ color: "#888" }} />}
      />
    </Tooltip>
  );
}

export default SearchBox;
