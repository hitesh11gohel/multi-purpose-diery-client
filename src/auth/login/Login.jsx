/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "../../components/card/Card";
import {
  Box,
  CircularProgress,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import swal from "sweetalert";
import Axios from "axios";
import { signIn } from "../../service";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      navigate("/");
    }
  }, []);

  const [isPassword, setIsPassword] = useState(true);

  const onSubmit = (cred) => {
    setLoading(true);
    Axios({ url: signIn, method: "POST", data: cred })
      .then((res) => {
        setLoading(false);
        swal({
          title: "Logged in successfully!",
          icon: "success",
          button: "Go!",
        }).then(() => {
          localStorage.setItem("loggedIn", JSON.stringify(res.data.user));
          reset();
          navigate("/");
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error :", err);
        return swal({
          title: "Authantication Error!",
          text: "Invalid email or password!",
          icon: "error",
          button: "Retry!",
        });
      });
  };

  return (
    <Card>
      <Box className="login-container">
        <Typography variant="h4" textAlign={"center"}>
          Login
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box className="input-box">
            <Input
              name="email"
              placeholder="user@gmail.com"
              className="input"
              {...register("email", {
                required: "Please enter your email ***",
                maxLength: 80,
              })}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
            />
            {errors.email && <p className="errors">{errors.email?.message}</p>}
          </Box>

          <Box className="input-box">
            <Input
              name="password"
              placeholder="********"
              className="input"
              type={isPassword ? "password" : "text"}
              {...register("password", {
                required: "Please enter your password ***",
                maxLength: 80,
              })}
              startAdornment={
                <InputAdornment position="start">
                  <VisibilityIcon onClick={() => setIsPassword(!isPassword)} />
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
            className="text-dark border-dark bg-light"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress color="primary" size={"24px"} />
            ) : (
              "Let's go"
            )}
          </Button>
          <Typography variant="body1" className="registerLink">
            Don't have an account ?
            <Link to="/register" className="routerLink">
              Create one
            </Link>
          </Typography>
        </form>
      </Box>
    </Card>
  );
};

export default Login;
