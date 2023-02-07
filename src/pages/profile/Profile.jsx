import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Input,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import "./profile.scss";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useForm } from "react-hook-form";

const Profile = () => {
  const navigate = useNavigate();
  const { register } = useForm();
  const [enableActions] = useState(false);
  const user = JSON.parse(localStorage.getItem("loggedIn"));

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
      </div>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Stack sx={{ bgcolor: "rgba(0, 0, 0, 0.2)", my: 2, px: 2 }}>
        <Typography color="primary" variant="h6">
          Welcome Back, {user.name}
        </Typography>
      </Stack>
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2} className="my-1">
          {/* Title */}
          <Grid item xs={4}>
            Name :
          </Grid>
          <Grid item xs={8}>
            <Input
              fullWidth
              name="name"
              {...register("name", { value: user.name })}
              disabled={enableActions ? false : true}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={4}>
            UserName :
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

          {/* Date */}
          <Grid item xs={4}>
            Email :
          </Grid>
          <Grid item xs={8}>
            <Input
              fullWidth
              name="email"
              disabled={enableActions ? false : true}
              {...register("email", { value: user.email })}
            />
          </Grid>

          {/* Budget */}
          <Grid item xs={4}>
            Mobile :
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

          {/* Payment Type */}
          {/* <Grid item xs={4}>
              Payment Type :
            </Grid>
            <Grid item xs={8}>
              <Select
                fullWidth
                name="paymentType"
                variant="standard"
                defaultValue={user.paymentType}
                disabled={enableActions ? false : true}
                {...register("paymentType", { value: user.paymentType })}
              >
                <MenuItem value="COD">COD</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
              </Select>
            </Grid> */}

          {/* Address */}
          {/* <Grid item xs={4}>
            Address :
          </Grid>
          <Grid item xs={8}>
            <Input
              fullWidth
              name="address"
              multiline
              rows={3}
              disabled={enableActions ? false : true}
              {...register("address", { value: user.address })}
            />
          </Grid> */}

          {/* Profile */}
          {/* <Grid item xs={4}>
            Profile :
          </Grid>
          <Grid item xs={8}>
            <img
              src={details?.image ?? noImage}
              alt="..."
              name="image"
              className="expense-image"
            />
          </Grid> */}
        </Grid>
      </Paper>
      {/* </form> */}
    </Box>
  );
};

export default Profile;
