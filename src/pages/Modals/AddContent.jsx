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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useForm } from "react-hook-form";
import TitleIcon from "@mui/icons-material/Title";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DescriptionIcon from "@mui/icons-material/Description";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ImageIcon from "@mui/icons-material/Image";
import "./addContent.scss";
import Axios from "axios";
import swal from "sweetalert";
import { addExpense } from "../../service";

export default function AddContent() {
  const [open, setOpen] = React.useState(false);

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

  const onSubmit = (formData) => {
    console.log("formData :", formData);
    if (formData.image) {
      formData.image = URL.createObjectURL(formData.image[0]);
    }
    Axios({
      url: addExpense,
      method: "POST",
      data: formData,
    })
      .then((res) => {
        if (res.status === 201) {
          handleClose();
          reset();
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

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)} className="modal-container">
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent>
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

            <Box className="input-box">
              <Input
                name="description"
                placeholder="Add description"
                className="input"
                startAdornment={
                  <InputAdornment position="start">
                    <DescriptionIcon />
                  </InputAdornment>
                }
              />
            </Box>

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

            <Box className="input-box">
              <Input
                name="image"
                placeholder="Add image"
                className="input"
                type="file"
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
    </>
  );
}
