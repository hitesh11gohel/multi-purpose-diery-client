import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Input,
  // MenuItem,
  Paper,
  // Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import "./profile.scss";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useForm } from "react-hook-form";
import noImage from "../../assets/noImage.png";
import EditIcon from "@mui/icons-material/Edit";
import Axios from "axios";
import swal from "sweetalert";
import { updateUserInfo } from "../../service";
import SaveIcon from "@mui/icons-material/Save";

const Profile = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [enableActions, setEnableActions] = useState(false);
  const user = JSON.parse(localStorage.getItem("loggedIn"));
  const headerObj = {
    "Access-Control-Allow-Headers": "x-access-token",
    "x-access-token": user?.token,
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("mobile", data.mobile);
    formData.append("address", data.address);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("profile", data.profile[0]);

    Axios({
      method: "PATCH",
      url: `${updateUserInfo}/${user.id}`,
      headers: headerObj,
      data: formData,
    })
      .then((res) => (res.status === 200 ? showDialog(true) : showDialog()))
      .catch((err) => showDialog());
  };

  const showDialog = (success = false) => {
    return swal({
      title: success ? "User Updated Successfully" : "Oops!",
      text: success ? "" : "Something went wrong!",
      icon: success ? "success" : "error",
      button: success ? "Ok" : "Retry!",
    }).then(() => {
      swal({
        title: "Stay Signed in",
        text: "You need to login again",
        icon: "info",
        button: "Ok",
        closeOnClickOutside: false,
        closeOnEsc: false,
      }).then((out) => {
        if (out) {
          localStorage.removeItem("loggedIn");
          navigate("/");
        }
      });
    });
  };

  return (
    <Box className="profile-container m-3">
      <div className={`d-flex justify-content-between align-items-center`}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            backgroundColor:
              localStorage.getItem("themeColor") === "#ffffff"
                ? "rgba(0, 0, 0, 0.2)"
                : "transparent",
          }}
        >
          <ArrowBackIosNewIcon />
        </Button>
        <Tooltip title={enableActions ? "Disable Actions" : "Enable Actions"}>
          <Button
            variant="outlined"
            onClick={() => setEnableActions(!enableActions)}
            sx={{
              backgroundColor:
                localStorage.getItem("themeColor") === "#ffffff"
                  ? "rgba(0, 0, 0, 0.2)"
                  : "transparent",
            }}
          >
            <EditIcon />
          </Button>
        </Tooltip>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ bgcolor: "rgba(255, 255, 255, 0.5)", my: 2, px: 2 }}>
          <Typography color="primary" variant="h6">
            Welcome Back, {user.name}
          </Typography>
        </Stack>
        <Paper sx={{ p: 2, mt: 2 }}>
          <Grid container spacing={2} className="my-1">
            {/* Name */}
            <Grid item xs={4}>
              <Typography color={"primary"}>Name :</Typography>
            </Grid>
            <Grid item xs={8}>
              <Input
                fullWidth
                name="name"
                {...register("name", { value: user.name })}
                disabled={enableActions ? false : true}
              />
            </Grid>

            {/* UserName */}
            <Grid item xs={4}>
              <Typography color={"primary"}>UserName :</Typography>
            </Grid>
            <Grid item xs={8}>
              <Input
                fullWidth
                disabled={enableActions ? false : true}
                name="username"
                {...register("username", {
                  value: user.username,
                })}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={4}>
              <Typography color={"primary"}>Email :</Typography>
            </Grid>
            <Grid item xs={8}>
              <Input
                fullWidth
                name="email"
                disabled={enableActions ? false : true}
                {...register("email", { value: user.email })}
              />
            </Grid>

            {/* Mobile */}
            <Grid item xs={4}>
              <Typography color={"primary"}>Mobile :</Typography>
            </Grid>
            <Grid item xs={8}>
              <Input
                fullWidth
                name="mobile"
                variant="standard"
                disabled={enableActions ? false : true}
                {...register("mobile", { value: user.mobile })}
              />
            </Grid>

            {/* Address */}
            {(user.address || enableActions) && (
              <>
                <Grid item xs={4}>
                  <Typography color={"primary"}>Address :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Input
                    fullWidth
                    name="address"
                    disabled={enableActions ? false : true}
                    {...register("address", { value: user.address })}
                  />
                </Grid>
              </>
            )}

            {/* State */}
            {/* <Grid item xs={4}>
              <Typography color={"primary"}>State :</Typography>
            </Grid>
            <Grid item xs={8}>
              <Select
                fullWidth
                name="state"
                variant="standard"
                defaultValue={user.state}
                disabled={enableActions ? false : true}
                {...register("state", { value: user.state })}
              >
                <MenuItem value="gujrat">Gujrat</MenuItem>
                <MenuItem value="goa">Goa</MenuItem>
                <MenuItem value="hampshire">Hampshire</MenuItem>
                <MenuItem value="oxfordshire">Oxfordshire</MenuItem>
                <MenuItem value="queensland">Queensland</MenuItem>
                <MenuItem value="victoria">Victoria</MenuItem>
              </Select>
            </Grid> */}

            {/* Country */}
            {/* <Grid item xs={4}>
              <Typography color={"primary"}>Country :</Typography>
            </Grid>
            <Grid item xs={8}>
              <Select
                fullWidth
                name="country"
                variant="standard"
                defaultValue={user.country}
                disabled={enableActions ? false : true}
                {...register("country", { value: user.country })}
              >
                <MenuItem value="india">India</MenuItem>
                <MenuItem value="england">England</MenuItem>
                <MenuItem value="australia">Australia</MenuItem>
              </Select>
            </Grid> */}

            {/* Profile */}
            {(user.profile || enableActions) && (
              <>
                <Grid item xs={4}>
                  <Typography color={"primary"}>Profile :</Typography>
                </Grid>
                <Grid item xs={8}>
                  {enableActions ? (
                    <Input
                      fullWidth
                      name="profile"
                      type="file"
                      {...register("profile")}
                    />
                  ) : (
                    <img
                      src={user?.profile ?? noImage}
                      alt="..."
                      name="image"
                      className="user-profile"
                    />
                  )}
                </Grid>{" "}
              </>
            )}
          </Grid>
          <Button
            variant="outlined"
            color="primary"
            type="submit"
            className={`${enableActions ? "d-block" : "d-none"} mt-4`}
            fullWidth
          >
            <SaveIcon /> <span>UPDATE</span>
          </Button>
        </Paper>
      </form>
    </Box>
  );
};

export default Profile;
