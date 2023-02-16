import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import LogoutIcon from "@mui/icons-material/Logout";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { SwatchesPicker } from "react-color";
import {
  Avatar,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SyncIcon from "@mui/icons-material/Sync";

export default function Header(props) {
  const navigate = useNavigate();
  const popover = React.useRef();
  const InitColor = localStorage.getItem("themeColor");
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState(InitColor ? InitColor : "#000");
  const [drawerState, setDrawerState] = React.useState(false);
  const currentTheme = InitColor === "#ffffff" ? "#000" : InitColor;
  const ThemeBackGround =
    InitColor === "#ffffff" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.8)";

  const toggleDrawer = (open) => (event) => setDrawerState(open);

  const handleColorChange = (e) => {
    setColor(e.hex);
    localStorage.setItem("themeColor", e.hex);
    props.fromChild(e.hex);
    setIsOpen(false);
  };

  const handleMenu = () => {
    swal({
      title: "Log out!",
      text: "You will be returned to the login screen!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((out) => {
      if (out) {
        navigate("/login");
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("expenses");
      }
    });
  };

  const fullSync = () => {
    swal({
      title: "Synchronization",
      text: "Data synchronization in progress, please wait ...",
      icon: "info",
      closeOnClickOutside: false,
      closeOnEsc: false,
    }).then((out) => {
      if (out) {
        localStorage.removeItem("expenses");
      }
    });
  };

  React.useEffect(() => localStorage.setItem("themeColor", color), [color]);

  const list = () => (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon sx={{ color: currentTheme }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} sx={{ color: currentTheme }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/profile")}>
            <ListItemIcon sx={{ color: currentTheme }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} sx={{ color: currentTheme }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setIsOpen(!isOpen)}>
            <ListItemIcon sx={{ color: currentTheme }}>
              <DisplaySettingsIcon />
            </ListItemIcon>
            <ListItemText primary={"Theme"} sx={{ color: currentTheme }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={() => navigate("/chart")}>
          <ListItemButton>
            <ListItemIcon sx={{ color: currentTheme }}>
              <DonutLargeIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Generate Chart"}
              sx={{ color: currentTheme }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <List sx={{ position: "absolute", bottom: 0, width: "100%" }}>
        <Divider />
        <ListItem disablePadding onClick={() => fullSync()}>
          <ListItemButton>
            <ListItemIcon sx={{ color: currentTheme }}>
              <SyncIcon />
            </ListItemIcon>
            <ListItemText primary={"Full Sync"} sx={{ color: currentTheme }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding onClick={() => handleMenu()}>
          <ListItemButton>
            <ListItemIcon sx={{ color: currentTheme }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Log out"} sx={{ color: currentTheme }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: ThemeBackGround }}>
        <Drawer
          anchor={"left"}
          open={drawerState}
          onClose={toggleDrawer(false)}
        >
          {list()}
        </Drawer>

        {localStorage.getItem("loggedIn") && (
          <Toolbar className="d-flex justify-content-between">
            <Button onClick={toggleDrawer(true)}>
              <MenuIcon />
            </Button>
            <Avatar
              sx={{ width: 30, height: 30 }}
              alt={JSON.parse(localStorage.getItem("loggedIn"))?.name}
              src={JSON.parse(localStorage.getItem("loggedIn"))?.profile}
            />
          </Toolbar>
        )}

        {isOpen && (
          <Box ref={popover} className="colorPicker">
            <SwatchesPicker
              width={275}
              height={"auto"}
              color={color}
              onChangeComplete={handleColorChange}
            />
          </Box>
        )}
      </AppBar>
    </Box>
  );
}
