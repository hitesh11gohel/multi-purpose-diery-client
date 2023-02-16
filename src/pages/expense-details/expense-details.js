/* eslint-disable react-hooks/exhaustive-deps */
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./expense-details.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteExpense, updateExpense } from "../../service";
import Axios from "axios";
import swal from "sweetalert";
import { useForm } from "react-hook-form";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import noImage from "../../../src/assets/noImage.png";

const ExpenseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const [enableActions, setEnableActions] = useState(false);
  const user = JSON.parse(localStorage.getItem("loggedIn"));
  const [loading, setLoading] = useState(false);
  const headerObj = {
    "Access-Control-Allow-Headers": "x-access-token",
    "x-access-token": user?.token,
  };

  useEffect(() => {
    if (state?.expense) {
      setDetails(state.expense);
    }
  }, []);

  const handleDelete = (id) => {
    swal({
      title: "Delete!",
      text: "Are you sure you want to delete this thread!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((out) => {
      if (out) {
        Axios({
          method: "DELETE",
          url: deleteExpense + "/" + id,
          headers: headerObj,
        })
          .then(() => navigate("/"))
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

  const { register, handleSubmit } = useForm();

  const onSubmit = (formData) => {
    setLoading(true);
    Axios({
      method: "PATCH",
      url: `${updateExpense}/${details._id}`,
      headers: headerObj,
      data: formData,
    })
      .then((res) => (res.status === 201 ? showDialog(true) : showDialog()))
      .catch((err) => showDialog());
  };

  const showDialog = (success = false) => {
    setLoading(false);
    return swal({
      title: success ? "Record Updated Successfully" : "Oops!",
      text: success ? "" : "Something went wrong!",
      icon: success ? "success" : "error",
      button: success ? "Ok" : "Retry!",
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <Box className="expense-details-container">
      <Backdrop
        open={loading}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="primary" />
      </Backdrop>
      {Object.keys(details).length > 0 ? (
        <div className="m-3">
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
            <Tooltip
              title={enableActions ? "Disable Actions" : "Enable Actions"}
            >
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
            <Paper sx={{ p: 2, mt: 2 }}>
              <Grid container spacing={2} className="my-1">
                {/* Title */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Expense :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Input
                    fullWidth
                    name="title"
                    multiline
                    rows={3}
                    {...register("title", { value: details.title })}
                    disabled={enableActions ? false : true}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Description :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Input
                    fullWidth
                    disabled={enableActions ? false : true}
                    name="description"
                    {...register("description", {
                      value: details.descreption ? details.descreption : "",
                    })}
                  />
                </Grid>

                {/* Date */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Date :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Input
                    fullWidth
                    name="date"
                    type="date"
                    disabled={enableActions ? false : true}
                    {...register("date", { value: details.date })}
                  />
                </Grid>

                {/* Budget */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Amount :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Input
                    fullWidth
                    name="budget"
                    variant="standard"
                    defaultValue={details.budget}
                    disabled={enableActions ? false : true}
                    {...register("budget", { value: details.budget })}
                    startAdornment={
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon />
                      </InputAdornment>
                    }
                  />
                </Grid>

                {/* Payment Type */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Payment Type :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Select
                    fullWidth
                    name="paymentType"
                    variant="standard"
                    defaultValue={details.paymentType}
                    disabled={enableActions ? false : true}
                    {...register("paymentType", { value: details.paymentType })}
                  >
                    <MenuItem value="COD">COD</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                  </Select>
                </Grid>

                {/* Address */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Address :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Input
                    fullWidth
                    name="address"
                    multiline
                    rows={3}
                    disabled={enableActions ? false : true}
                    {...register("address", { value: details.address })}
                  />
                </Grid>

                {/* Profile */}
                <Grid item xs={4}>
                  <Typography color={"primary"}>Profile :</Typography>
                </Grid>
                <Grid item xs={8}>
                  <img
                    src={details?.image !== "" ? details.image : noImage}
                    alt="..."
                    name="image"
                    className="expense-image"
                  />
                </Grid>
              </Grid>
              <Box
                className={`${
                  enableActions ? "d-block" : "d-none"
                } mt-5 d-flex justify-content-center align-items-center`}
              >
                <Button
                  variant="outlined"
                  color="success"
                  type="submit"
                  className="mx-2"
                >
                  <SaveIcon /> <span style={{ marginLeft: "5px" }}>SAVE</span>
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(details._id)}
                  className="mx-2"
                >
                  <DeleteIcon />{" "}
                  <span style={{ marginLeft: "5px" }}>DELETE</span>
                </Button>
              </Box>
            </Paper>
          </form>
        </div>
      ) : (
        <div className="no-data-found">
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
          >
            No Data Found
          </Button>
        </div>
      )}
    </Box>
  );
};

export default ExpenseDetails;
