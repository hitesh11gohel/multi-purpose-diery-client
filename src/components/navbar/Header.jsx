import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { Typography } from "@mui/material";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../service";
import Axios from "axios";

export default function Header() {
  const navigate = useNavigate();
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "transparent" }}>
        {localStorage.getItem("loggedIn") && (
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }} />
            <IconButton
              size="large"
              onClick={() => handleMenu()}
              color="inherit"
            >
              <LogoutIcon color="primary" />
            </IconButton>
          </Toolbar>
        )}
      </AppBar>
    </Box>
  );
}
