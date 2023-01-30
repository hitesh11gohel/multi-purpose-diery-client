/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Input,
  InputAdornment,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import "./dashboard.scss";
import AddContent from "../Modals/AddContent";
import Axios from "axios";
import { getExpenses, getExpense, deleteExpense } from "../../service";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import moment from "moment";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { sum } from "lodash";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import BarChartIcon from "@mui/icons-material/BarChart";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [cloneItems, setCloneItems] = useState([]);
  const [months, setMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [isChartViewEnable, setIsChartViewEnable] = useState(false);
  const [enableAction, setEnableAction] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) fetchAllRecords();
  }, []);
  useEffect(() => getMonthWiseData(), [items]);

  const handleChildData = () => fetchAllRecords();
  const clearCurrentMonthValue = (value) => setCurrentMonth(value);
  const handleDoubleClickEvent = (value) => {
    Axios({ url: `${getExpense}/${value}`, method: "GET" })
      .then((res) => {
        navigate(`/expense-detail/${value}`, {
          state: { expense: res.data.data },
        });
      })
      .catch((err) => console.log("Error :", err));
  };

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
    const filtered = [];
    items.filter((item) => {
      if (item.title.toLowerCase().includes(e.target.value.toLowerCase())) {
        return filtered.push(item);
      } else if (item.date.toString().includes(e.target.value)) {
        return filtered.push(item);
      } else if (item.budget.toString().includes(e.target.value)) {
        return filtered.push(item);
      } else if (
        item.address.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        return filtered.push(item);
      }
      return [];
    });
    // const filtered = items.filter((item) => item.title.toLowerCase().includes(e.target.value.toLowerCase());
    filtered.length > 0 && setItems(filtered);
  }, 500);

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
          .then(() => fetchAllRecords())
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
            handleDoubleClick={handleDoubleClickEvent}
            isEnableActions={enableAction}
            setEnableActions={setEnableAction}
            isChartViewEnable={isChartViewEnable}
            setIsChartViewEnable={setIsChartViewEnable}
            handleDeleteItem={handleDelete}
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
  handleDoubleClick,
  isEnableActions,
  setEnableActions,
  handleDeleteItem,
  isChartViewEnable,
  setIsChartViewEnable,
}) => {
  items = items.filter(
    (item) =>
      moment(item.date, "YYYY-MM-DD").month() ===
      moment(currentMonth, "MMMM").month()
  );
  let total = items.map((item) => item.budget);
  total = sum(total);
  const daysInMonth = moment(currentMonth, "MMM").daysInMonth();
  let monthlyDate = Array.from(Array(daysInMonth + 1).keys());
  let chartDayValues = [];
  monthlyDate.forEach((ele) => {
    const formattedEle = ele >= 10 ? String(ele) : `0${ele}`;
    const isMatched = items.filter(
      (item) => formattedEle === moment(item.date, "YYYY-MM-DD").format("DD")
    );
    // const isMatched2 = items.filter((item) => formattedEle === (moment(item.date, "YYYY-MM-DD").format("DD") >= 10 ? moment(item.date, "YYYY-MM-DD").format("DD") : moment(item.date, "YYYY-MM-DD").format("DDD")));
    if (isMatched.length > 0) {
      let total = 0;
      isMatched.map((el) => el.budget).forEach((s) => (total += Number(s)));
      chartDayValues.push(total);
    } else {
      chartDayValues.push(0);
    }
  });

  monthlyDate.shift();
  chartDayValues.shift();
  return (
    <>
      <Box className="d-flex justify-content-between align-items-center">
        <Button onClick={() => clearCurrentMonth("")}>
          <ArrowBackIosNewIcon />
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
        <Tooltip title="Open Chart View">
          <Button onClick={() => setIsChartViewEnable(!isChartViewEnable)}>
            <BarChartIcon />
          </Button>
        </Tooltip>
        <Tooltip title={isEnableActions ? "Disable Action" : "Enable Action"}>
          <Switch
            disabled={isChartViewEnable}
            checked={isEnableActions}
            onChange={() => setEnableActions(!isEnableActions)}
          />
        </Tooltip>
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
      {isChartViewEnable ? (
        <ChartView
          daysInMonth={monthlyDate}
          currentMonth={currentMonth}
          chartDataArr={chartDayValues}
        />
      ) : items.length > 0 ? (
        items.map(({ _id, title, address, date, budget }) => {
          return (
            <Card
              key={_id}
              className="card"
              onDoubleClick={() => handleDoubleClick(_id)}
            >
              <Box className="box-container">
                <Avatar sx={{ mr: 2 }}>{title.charAt(0)}</Avatar>
                <div className="flex-grow-1">
                  <Typography variant="body1" color="primary">
                    {title.includes(" ")
                      ? `${title.split(" ")[0]} ${title.split(" ")[1]}
                        ${title.split(" ")[2] ? title.split(" ")[2] : ""}`
                      : title}
                  </Typography>
                  <Typography variant="body2">
                    {address.length > 22
                      ? `${address.substr(0, 22)}...`
                      : address}
                  </Typography>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Typography variant="body2">{date}</Typography>
                  <Typography variant="body2">
                    <CurrencyRupeeIcon sx={{ width: "14px" }} />
                    <span>{budget} </span>
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  className={`${
                    isEnableActions ? "d-block" : "d-none"
                  } action-button my-1 mx-3`}
                  onClick={() => handleDeleteItem(_id)}
                >
                  <DeleteForeverIcon />
                </Button>
                {/* <img src="blob:http://localhost:3000/b03b6039-6e44-4bfd-8107-c9b9fb567ae7" alt="okay" width={100} height={100} /> */}
              </Box>
            </Card>
          );
        })
      ) : (
        <Typography variant="h6" className="data-not-found">
          {`Data not available in ${currentMonth} Month`}
        </Typography>
      )}
    </>
  );
};

const ChartView = ({ daysInMonth, currentMonth, chartDataArr }) => {
  const chartData = {
    labels: daysInMonth,
    datasets: [
      {
        axis: "y",
        label: "Expense report ",
        data: chartDataArr,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(155, 159, 64, 0.2)",
          "rgba(255, 205, 146, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 003, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(155, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 003, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Bar
      data={chartData}
      options={{
        indexAxis: "y",
        responsive: true,
        aspectRatio: 1 / 1.7,
        barThickness: 16,
        plugins: {
          title: { display: true, text: `${currentMonth}'s expense report` },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (item) =>
                `${item.dataset.label}: ${item.formattedValue} Rs`,
            },
          },
        },
      }}
    />
  );
};

export default Dashboard;
