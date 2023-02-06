import * as React from "react";
import {
  Box,
  Fab,
  Button,
  Input,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import TitleIcon from "@mui/icons-material/Title";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageIcon from "@mui/icons-material/Image";
import PaymentsIcon from "@mui/icons-material/Payments";
import "./addContent.scss";
import Axios from "axios";
import swal from "sweetalert";
import { addExpense } from "../../service";

export default function AddContent(props) {
  const [open, setOpen] = React.useState(false);
  const user = JSON.parse(localStorage.getItem("loggedIn"));
  const headerObj = {
    "Access-Control-Allow-Headers": "x-access-token",
    "x-access-token": user.token,
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // const [age, setAge] = React.useState("");

  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("address", data.address);
    formData.append("budget", data.budget);
    formData.append("date", data.date);
    formData.append("description", data.description);
    formData.append("image", data.image[0]);
    formData.append("paymentType", data.paymentType);
    formData.append("title", data.title);

    Axios({
      url: addExpense,
      method: "POST",
      data: formData,
      headers: headerObj,
    })
      .then((res) => {
        if (res.status === 201) {
          handleClose();
          reset();
          props.fetchRecords(true);
        } else {
          showDialog();
        }
      })
      .catch((e) => showDialog());
  };

  const showDialog = () => {
    return swal({
      title: "Oops!",
      text: "Something went wrong!",
      icon: "error",
      button: "Retry!",
    });
  };
  return (
    <>
      <Box className="floating">
        <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
          <AddIcon />
        </Fab>
      </Box>

      <Dialog open={open} onClose={handleClose} scroll="body">
        <form onSubmit={handleSubmit(onSubmit)} className="modal-container">
          <DialogTitle
            color={
              localStorage.getItem("themeColor") === "#ffffff"
                ? "#000"
                : "primary"
            }
          >
            Add Item
          </DialogTitle>
          <DialogContent>
            {/* Title */}
            <Box className="input-box">
              <Input
                name="title"
                placeholder="Add title"
                className="input"
                {...register("title", {
                  required: "Please enter title ***",
                  maxLength: 80,
                })}
                startAdornment={
                  <InputAdornment position="start">
                    <TitleIcon />
                  </InputAdornment>
                }
              />
              {errors.title && (
                <p className="errors">{errors.title?.message}</p>
              )}
            </Box>

            {/* Description */}
            <Box className="input-box">
              <Input
                name="description"
                placeholder="Add description"
                className="input"
                {...register("description")}
                startAdornment={
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                }
              />
            </Box>

            {/* Address */}
            <Box className="input-box">
              <Input
                name="address"
                placeholder="Add location"
                className="input"
                {...register("address", {
                  required: "Please enter location ***",
                  maxLength: 80,
                })}
                startAdornment={
                  <InputAdornment position="start">
                    <AddLocationIcon />
                  </InputAdornment>
                }
              />
              {errors.address && (
                <p className="errors">{errors.address?.message}</p>
              )}
            </Box>

            {/* Date */}
            <Box className="input-box">
              <Input
                name="date"
                className="input"
                type="date"
                {...register("date", {
                  required: "Please enter date ***",
                  maxLength: 80,
                })}
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarMonthIcon />
                  </InputAdornment>
                }
              />
              {errors.date && <p className="errors">{errors.date?.message}</p>}
            </Box>

            {/* Budget */}
            <Box className="input-box">
              <Input
                name="budget"
                placeholder="Add budget"
                className="input"
                type="text"
                {...register("budget", {
                  required: "Please enter budget ***",
                  maxLength: 80,
                })}
                startAdornment={
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon />
                  </InputAdornment>
                }
              />
              {errors.budget && (
                <p className="errors">{errors.budget?.message}</p>
              )}
            </Box>

            {/* Payment type */}
            <Box className="input-box">
              <Select
                name="paymentType"
                variant="standard"
                fullWidth
                defaultValue="COD"
                {...register("paymentType")}
                startAdornment={
                  <InputAdornment position="start">
                    <PaymentsIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="COD"> COD </MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
              </Select>
            </Box>

            {/* image */}
            <Box className="input-box">
              <Input
                name="image"
                placeholder="Add image"
                className="input"
                type="file"
                {...register("image")}
                // {...register("image", { required: "Please add image ***" })}
                startAdornment={
                  <InputAdornment position="start">
                    <ImageIcon />
                  </InputAdornment>
                }
              />
              {/* {errors.image && (
                <p className="errors">{errors.image?.message}</p>
              )} */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* <Snackbar
        open={open}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        // onClose={handleClose}
        message="Note archived"
        // action={action}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
    </>
  );
}
