/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./expense-details.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteExpense } from "../../service";
import Axios from "axios";
import swal from "sweetalert";

const ExpenseDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [details, setDetails] = useState({});

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

  console.log("details :", details);
  return (
    <>
      {Object.keys(details).length > 0 ? (
        <div className="m-4">
          <Button variant="outlined" onClick={() => navigate("/")}>
            <ArrowBackIosNewIcon />
          </Button>
          <Paper sx={{ p: 2, mt: 2 }}>
            <CustomGrid name="Expense" data={details.title} hasColor={true} />
            <CustomGrid name="Description" data={details.descreption} />
            <CustomGrid name="Date" data={details.date} />
            <CustomGrid name="Budget" data={`₹ ${details.budget}`} />
            <CustomGrid name="Payment Type" data={details.paymentType} />
            <CustomGrid name="Address" data={details.address} />
            {/* <img src={details.image} alt="..." width="100" /> */}
            <Button
              className="my-3"
              variant="outlined"
              fullWidth
              onClick={() => handleDelete(details._id)}
            >
              <DeleteIcon /> <span style={{ marginLeft: "5px" }}>DELETE</span>
            </Button>
          </Paper>
        </div>
      ) : (
        <Button variant="outlined" onClick={() => navigate("/")}>
          No Data Found
        </Button>
      )}
    </>
  );
};

const CustomGrid = ({ name, data, hasColor }) => {
  return (
    <Grid container spacing={2} className="my-1">
      <Grid item xs={4}>
        {name} :
      </Grid>
      <Grid item xs={8}>
        {hasColor ? (
          <Typography color={"primary"}>{data}</Typography>
        ) : (
          <Typography>{data}</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ExpenseDetails;
