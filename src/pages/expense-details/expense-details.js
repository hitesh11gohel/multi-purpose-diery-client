/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Grid,
  Input,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Tooltip,
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

const ExpenseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState({});
  const [enableActions, setEnableActions] = useState(false);

  useEffect(() => {
    state?.expense && setDetails(state.expense);
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
        Axios.delete(deleteExpense + "/" + id)
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
    Axios.patch(`${updateExpense}/${details._id}`, formData)
      .then((res) => (res.status === 201 ? showDialog(true) : showDialog()))
      .catch((err) => showDialog());
  };

  const showDialog = (success = false) => {
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
    <>
      {Object.keys(details).length > 0 ? (
        <div className="m-4">
          <div className={`d-flex justify-content-between align-items-center`}>
            <Button variant="outlined" onClick={() => navigate("/")}>
              <ArrowBackIosNewIcon />
            </Button>
            <Tooltip
              title={enableActions ? "Disable Actions" : "Enable Actions"}
            >
              <Button
                variant="outlined"
                onClick={() => setEnableActions(!enableActions)}
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
                  Expense :
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
                  Description :
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
                  Date :
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
                  Amount :
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
                  Payment Type :
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
                  Address :
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
              </Grid>
              <Box
                className={`${
                  enableActions ? "d-block" : "d-none"
                } mt-5 d-flex justify-content-center align-items-center`}
              >
                <Button
                  variant="outlined"
                  color="success"
                  // onClick={() => handleUpdate(details._id)}
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
        <Button variant="outlined" onClick={() => navigate("/")}>
          No Data Found
        </Button>
      )}
    </>
  );
};

export default ExpenseDetails;
