import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemContent,
  Avatar,
  Typography,
  Chip,
  Link,
  IconButton,
  MenuButton,
  ListDivider,
  ListItemDecorator,
  Menu,
  MenuItem,
  Divider,
  Dropdown,
  CircularProgress,
} from "@mui/joy";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "api";



function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}
function RolesList() {
  const { data, isLoading } = useQuery({
    queryKey: "roles",
    queryFn: getRoles,
  });

  return (
    <Box sx={{ display: { xs: "block", sm: "none" } }}>
      {
        !isLoading ? (
          data?.roles.map((listItem) => (
            <List key={listItem.id} size="sm" sx={{ "--ListItem-paddingX": 0 }}>
              <ListItem
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <ListItemContent
                  sx={{ display: "flex", gap: 2, alignItems: "start" }}
                >
                  {/* <ListItemDecorator>
                    <Avatar size="sm">{listItem.customer.initial}</Avatar>
                  </ListItemDecorator> */}
                  <div>
                    <Typography gutterBottom sx={{ fontWeight: 600, marginLeft: "4px" }}>
                      {listItem.name}
                    </Typography>
                    {/* <Typography level="body-xs" gutterBottom>
                      {listItem.customer.email}
                    </Typography> */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      <Chip variant="soft" size="sm">
                        <Typography level="body-xs">
                          {new Date(listItem.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: false,
                          })}
                        </Typography>
                      </Chip>
                      <Typography level="body-xs">&bull;</Typography>
                      <Typography level="body-xs">{listItem.id}</Typography>
                    </Box>
                    <Typography level="body-xs">{listItem.description}</Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, marginLeft: "4px" }}
                    >
                      <Link level="body-sm" component="button">
                        Download
                      </Link>
                      <RowMenu />
                    </Box>
                  </div>
                </ListItemContent>
                {/* <Chip
                  variant="soft"
                  size="sm"
                  startDecorator={
                    {
                      Paid: <CheckRoundedIcon />,
                      Refunded: <AutorenewRoundedIcon />,
                      Cancelled: <BlockIcon />,
                    }[listItem.status]
                  }
                  color={
                    {
                      Paid: 'success',
                      Refunded: 'neutral',
                      Cancelled: 'danger',
                    }[listItem.status]
                  }
                >
                  {listItem.status}
                </Chip> */}
              </ListItem>
              <ListDivider />
            </List>
          ))
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <CircularProgress size="sm"/>
          </Box>
        )
      }
      {/* <Box
        className="Pagination-mobile"
        sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', py: 2 }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" sx={{ mx: 'auto' }}>
          Page 1 of 10
        </Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box> */}
    </Box>
  );
}

export default RolesList;
