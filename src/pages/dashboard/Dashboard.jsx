/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import "./dashboard.scss";
import AddContent from "../Modals/AddContent";
import Axios from "axios";
import { getExpenses } from "../../service";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import moment from "moment";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { sum } from "lodash";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cloneItems, setCloneItems] = useState([]);
  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => fetchAllRecords(), []);
  useEffect(() => getMonthWiseData(), [items]);

  const handleChildData = () => fetchAllRecords();
  const clearCurrentMonthValue = (value) => setCurrentMonth(value);

  const fetchAllRecords = () => {
    Axios.get(getExpenses)
      .then((res) => {
        if (res.status === 200) {
          setItems(res.data.data);
          setCloneItems(res.data.data);
        } else {
          showDialog();
        }
      })
      .catch((e) => {
        console.log("Error :", e);
        showDialog(true);
      });
  };

  const showDialog = (error = false) => {
    swal({
      title: error ? "Oops!" : "Session Expired",
      text: error ? "Something went wrong!" : "Please log in again.",
      icon: "error",
      button: "Ok",
      dangerMode: true,
    }).then((out) => {
      console.log(out, "==",error);
      if (out && error) {
        localStorage.removeItem("loggedIn");
        navigate("/login");
      }
    });
  };

  const getMonthWiseData = () => {
    let Months = items.map((item) => ({
      month: moment(item.date, "YYYY-MM-DD").format("MMMM"),
      year: moment(item.date, "YYYY-MM-DD").format("YYYY"),
    }));
    setMonths(
      Months.filter(
        (ele, i, arr) => i === arr.findIndex((t) => t.month === ele.month)
      )
    );
  };

  const handleChange = debounce((e) => {
    if (!e.target.value) {
      return setItems(cloneItems);
    }
    // search any value in filter
    // const filtered = [];
    // items.filter((item) => {
    //   if (item.title.toLowerCase().includes(e.target.value.toLowerCase())) {
    //     return filtered.push(item);
    //   } else if (item.date.toString().includes(e.target.value)) {
    //     return filtered.push(item);
    //   } else if (item.budget.toString().includes(e.target.value)) {
    //     return filtered.push(item);
    //   } else if (
    //     item.address.toLowerCase().includes(e.target.value.toLowerCase())
    //   ) {
    //     return filtered.push(item);
    //   }
    //   return [];
    // });
    const filtered = items.filter((item) =>
      item.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    filtered.length > 0 && setItems(filtered);
  }, 500);

  return (
    <Box className="dashboard-container" id="scroller">
      <div style={{ margin: "1rem" }}>
        {!currentMonth && (
          <MonthView months={months} fromChild={clearCurrentMonthValue} />
        )}
        {currentMonth && (
          <ExpenseList
            items={items}
            handleChange={handleChange}
            currentMonth={currentMonth}
            clearCurrentMonth={clearCurrentMonthValue}
          />
        )}
        <AddContent fetchRecords={handleChildData} />
      </div>
    </Box>
  );
};

const MonthView = (props) => {
  const { months } = props;
  const sendToParent = (month) => props.fromChild(month);
  return months.map((item, i) => {
    return (
      <Card
        key={i}
        className="card month-view"
        onClick={() => sendToParent(item.month)}
      >
        <Box sx={{ textAlign: "center", padding: "1rem" }}>
          <Typography variant="h6" color="primary">
            {item.month} - {item.year}
          </Typography>
        </Box>
      </Card>
    );
  });
};

const ExpenseList = ({
  items,
  handleChange,
  clearCurrentMonth,
  currentMonth,
}) => {
  items = items.filter(
    (item) =>
      moment(item.date, "YYYY-MM-DD").month() ===
      moment(currentMonth, "MMMM").month()
  );
  let total = items.map((item) => item.budget);
  total = sum(total);
  return (
    <>
      <Box className="d-flex justify-content-between align-items-center">
        <Button onClick={() => clearCurrentMonth("")}>
          <ArrowBackIosIcon />
        </Button>
        <Input
          fullWidth
          name="search"
          placeholder="Search ..."
          className="input search-input"
          sx={{ margin: "10px 0" }}
          onChange={handleChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </Box>
      <Box className="d-flex justify-content-between align-items-center bg-light py-2">
        <Typography variant="body1">
          <span className="mx-2">Total expense :</span>
        </Typography>
        <Typography variant="body1">
          <span className="mx-2 text-danger">
            <CurrencyRupeeIcon />
            {total}
          </span>
        </Typography>
      </Box>
      {items.length > 0 ? (
        items.map(({ _id, title, address, date, budget }) => {
          return (
            <Card key={_id} className="card">
              <Box className="box-container">
                <div>
                  <Typography variant="body1" color="primary">
                    {title.includes(" ")
                      ? title.split(" ")[0] + " " + title.split(" ")[1]
                      : title}
                  </Typography>
                  <Typography variant="body2">
                    {address.substr(0, 22)}...
                  </Typography>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Typography variant="body2">{date}</Typography>
                  <Typography variant="body2">
                    <CurrencyRupeeIcon sx={{ width: "14px" }} />
                    <span>{budget} </span>
                  </Typography>
                </div>
                {/* <img src="blob:http://localhost:3000/b03b6039-6e44-4bfd-8107-c9b9fb567ae7" alt="okay" width={100} height={100} /> */}
              </Box>
            </Card>
          );
        })
      ) : (
        <Card key="no_item" className="data-not-found">
          <Box className="box-container">No data found</Box>
        </Card>
      )}
    </>
  );
};

export default Dashboard;
