/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Grid, Paper, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./expense-details.scss";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteExpense } from "../../service";
import Axios from "axios";
import swal from "sweetalert";

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

  const handleUpdate = (id) => {
    console.log("Data updated successfully :", id);
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
              title={
                enableActions
                  ? "Disable Actions"
                  : "Enable Actions"
              }
            >
              <Button
                variant="outlined"
                onClick={() => setEnableActions(!enableActions)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
          </div>
          <Paper sx={{ p: 2, mt: 2 }}>
            <CustomGrid
              isUpdatable={enableActions}
              name="Expense"
              data={details.title}
              isMultiLine={true}
            />
            <CustomGrid
              isUpdatable={enableActions}
              name="Description"
              data={details.descreption}
            />
            <CustomGrid
              isUpdatable={enableActions}
              name="Date"
              data={details.date}
            />
            <CustomGrid
              isUpdatable={enableActions}
              name="Budget"
              data={`₹ ${details.budget}`}
            />
            <CustomGrid
              isUpdatable={enableActions}
              name="Payment Type"
              data={details.paymentType}
            />
            <CustomGrid
              isUpdatable={enableActions}
              name="Address"
              data={details.address}
              isMultiLine={true}
            />
            {/* <img src={details.image} alt="..." width="100" /> */}
            <Box
              className={`${
                enableActions ? "d-block" : "d-none"
              } my-2 d-flex justify-content-center align-items-center`}
            >
              <Button
                variant="outlined"
                color="success"
                onClick={() => handleUpdate(details._id)}
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
                <DeleteIcon /> <span style={{ marginLeft: "5px" }}>DELETE</span>
              </Button>
            </Box>
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

const CustomGrid = ({ name, data, isMultiLine, isUpdatable }) => {
  return (
    <Grid container spacing={2} className="my-1">
      <Grid item xs={4}>
        {name} :
      </Grid>
      <Grid item xs={8}>
        <TextField
          multiline
          rows={isMultiLine ? 3 : 1}
          variant="standard"
          value={data}
          disabled={isUpdatable ? false : true}
        />
      </Grid>
    </Grid>
  );
};

export default ExpenseDetails;
