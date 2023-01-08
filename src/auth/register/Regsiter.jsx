import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Card from "../../components/card/Card";
import { Box, Input, InputAdornment, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhoneIcon from "@mui/icons-material/Phone";
import MailIcon from "@mui/icons-material/Mail";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BadgeIcon from "@mui/icons-material/Badge";
import { signUp } from "../../service";
import Axios from "axios";
import swal from "sweetalert";

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [password, setPassword] = useState(true);

  const onSubmit = (user) => {
    Axios({ url: signUp, method: "POST", data: user })
      .then((res) => {
        if (res.status === 201) {
          reset();
          navigate("/");
        } else {
          return swal({
            title: "Oops!",
            text: "Something went wrong!",
            icon: "error",
            button: "Retry!",
          });
        }
      })
      .catch((err) => console.log("Err :", err));
  };

  return (
    <Card>
      <Box className="register-container">
        <Typography variant="h4" sx={{ margin: "1rem 0" }}>
          Register
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <Box className="input-box">
            <Input
              name="name"
              placeholder="Helly Cooper"
              className="input"
              {...register("name", {
                required: "Please enter your name ***",
                maxLength: 80,
              })}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
            {errors.name && <p className="errors">{errors.name?.message}</p>}
          </Box>

          <Box className="input-box">
            <Input
              name="username"
              placeholder="Helly11"
              className="input"
              {...register("username", {
                required: "Please enter user name ***",
                maxLength: 80,
              })}
              startAdornment={
                <InputAdornment position="start">
                  <BadgeIcon />
                </InputAdornment>
              }
            />
            {errors.username && (
              <p className="errors">{errors.username?.message}</p>
            )}
          </Box>

          <Box className="input-box">
            <Input
              name="email"
              placeholder="helly@gmail.com"
              className="input"
              autoComplete="new-password"
              type="email"
              {...register("email", {
                required: "Please enter your email ***",
                maxLength: 80,
              })}
              startAdornment={
                <InputAdornment position="start">
                  <MailIcon />
                </InputAdornment>
              }
            />
            {errors.email && <p className="errors">{errors.email?.message}</p>}
          </Box>

          <Box className="input-box">
            <Input
              name="mobile"
              placeholder="9988776655"
              className="input"
              type="text"
              {...register("mobile", {
                required: "Please enter your mobile ***",
                maxLength: 80,
              })}
              startAdornment={
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              }
            />
            {errors.mobile && (
              <p className="errors">{errors.mobile?.message}</p>
            )}
          </Box>

          <Box className="input-box">
            <Input
              name="password"
              placeholder="********"
              className="input"
              type={password ? "password" : "text"}
              {...register("password", {
                required: "Please enter your password ***",
              })}
              startAdornment={
                <InputAdornment
                  position="start"
                  onClick={() => setPassword(!password)}
                >
                  {password ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </InputAdornment>
              }
            />
            {errors.password && (
              <p className="errors">{errors.password?.message}</p>
            )}
          </Box>

          <Button
            variant="outlined"
            sx={{ margin: "1rem 0" }}
            type="submit"
            fullWidth
          >
            Register
          </Button>
          <Typography variant="body1" className="registerLink">
            Already have an account ?
            <Link to="/" className="routerLink">
              Sign in
            </Link>
          </Typography>
        </form>
      </Box>
    </Card>
  );
};

export default Register;
