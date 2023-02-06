import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { SwatchesPicker } from "react-color";
import {
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
          <ListItemButton>
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

        <ListItem disablePadding>
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
        <Divider />
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
            <IconButton
              size="large"
              onClick={() => handleMenu()}
              color="primary"
            >
              <LogoutIcon />
            </IconButton>
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
