import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Sheet,
  GlobalStyles,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  listItemButtonClasses,
  IconButton,
  Chip,
  LinearProgress,
  Button,
  Divider,
  Avatar,
  Stack,
  Card,
} from "@mui/joy";
// import icon
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
// product icon
import InventoryIcon from "@mui/icons-material/Inventory2Rounded";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { AdminPanelSettings, CategoryRounded } from "@mui/icons-material";
import { closeSidebar } from "utils/sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Toggler({ defaultExpanded = false, renderToggle, children }) {
  const [open, setOpen] = React.useState(defaultExpanded);
  const location = window.location.pathname;

  useEffect(() => {
    if (location === "/users" || location === "/profile") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [location]);

  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": {
              overflow: "hidden",
            },
          },
          open ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

function Sidebar({ user }) {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const [selected, setSelected] = React.useState(location);

  // get current location
  useEffect(() => {
    setSelected(location);
  }, [location]);

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        padding: "16px 8px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <BrightnessAutoRoundedIcon />
        </IconButton>
        <Typography level="title-lg">Acme Co.</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      />
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <NavLink to="/dashboard">
              <ListItemButton selected={selected === "/dashboard"}>
                <DashboardRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Dashboard</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/products">
              <ListItemButton selected={selected === "/products"}>
                <InventoryIcon />
                <ListItemContent>
                  <Typography level="title-sm">Products</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/orders">
              <ListItemButton selected={selected === "/orders"}>
                <ShoppingCartRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Orders</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/categories">
              <ListItemButton selected={selected === "/categories"}>
                <CategoryRounded />
                <ListItemContent>
                  <Typography level="title-sm">Categories</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/users">
              <ListItemButton selected={selected === "/users"}>
                <GroupRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Users</Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink to="/roles">
              <ListItemButton
                selected={selected === "/roles"}
              >
                <AdminPanelSettings />
                <ListItemContent>
                  <Typography level="title-sm">
                    Roles and Permissions
                  </Typography>
                </ListItemContent>
              </ListItemButton>
            </NavLink>
          </ListItem>
          <ListItem>
            <ListItemButton role="menuitem" component="a">
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Messages</Typography>
              </ListItemContent>
              <Chip size="sm" color="primary" variant="solid">
                4
              </Chip>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton>
              <SupportRoundedIcon />
              Support
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              Settings
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton color="danger">
              <LogoutRoundedIcon color="danger" />
              Logout
            </ListItemButton>
          </ListItem>
        </List>
        {/* <Card
          invertedColors
          variant="soft"
          color="warning"
          size="sm"
          sx={{ boxShadow: "none" }}
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography level="title-sm">Used space</Typography>
            <IconButton size="sm">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
          <Typography level="body-xs">
            Your team has used 80% of your available space. Need more?
          </Typography>
          <LinearProgress
            variant="outlined"
            value={80}
            determinate
            sx={{ my: 1 }}
          />
          <Button size="sm" variant="solid">
            Upgrade plan
          </Button>
        </Card> */}
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar
          variant="soft"
          size="sm"
          alt={user?.first_name}
          color="primary"
        />
        <Box sx={{ minWidth: 200, flex: 1 }}>
          <Typography level="title-sm">
            {user?.first_name + " " + user?.last_name}
          </Typography>
          <Typography level="body-xs">{user?.email}</Typography>
        </Box>
      </Box>
    </Sheet>
  );
}

export default Sidebar;
