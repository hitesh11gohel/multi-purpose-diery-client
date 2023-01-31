import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../service";
import Axios from "axios";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import { SwatchesPicker } from "react-color";
import { Tooltip } from "@mui/material";

export default function Header(props) {
  const navigate = useNavigate();
  const popover = React.useRef();
  const InitColor = localStorage.getItem("themeColor");
  const [isOpen, setIsOpen] = React.useState(false);
  const [color, setColor] = React.useState(InitColor ? InitColor : "#000");

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
        Axios({ url: signOut, method: "POST" })
          .then(() => {
            navigate("/login");
            localStorage.removeItem("loggedIn");
          })
          .catch(() => {
            swal({
              title: "Oops!",
              text: "Something went wrong!",
              icon: "warning",
            });
          });
      }
    });
  };

  React.useEffect(() => localStorage.setItem("themeColor", color), [color]);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        // color="inherit"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
      >
        {localStorage.getItem("loggedIn") && (
          <Toolbar className="d-flex justify-content-between">
            <Tooltip title="Change theme color">
              <IconButton
                size="large"
                onClick={() => setIsOpen(!isOpen)}
                color="primary"
              >
                <DisplaySettingsIcon />
              </IconButton>
            </Tooltip>
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
