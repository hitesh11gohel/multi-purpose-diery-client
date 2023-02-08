/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import "./doughnutChart.scss";
import { Button, MenuItem, Select, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Doughnut } from "react-chartjs-2";
import { getExpenses } from "../../service";
import Axios from "axios";
import moment from "moment";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Chart from "chart.js/auto";

const DoughnutChart = () => {
  const navigate = useNavigate();
  Chart.register(ChartDataLabels);
  const [allItems, setAllItems] = useState([]);
  const [selectedItems, setSeletcedItems] = useState([]);
  const [expenseYears, setExpenseYears] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [selectedYear, setSelectedYear] = useState("Select year");

  const InitColor = localStorage.getItem("themeColor");
  const headerObj = {
    "Access-Control-Allow-Headers": "x-access-token",
    "x-access-token": JSON.parse(localStorage.getItem("loggedIn"))?.token,
  };
  const chartData = {
    labels: selectedItems.map((item) => item.month),
    datasets: [
      {
        label: "Expense",
        data: selectedItems.map((item) => item.total),
        backgroundColor: [
          "#4dc9f6",
          "#f67019",
          "#f53794",
          "#537bc4",
          "#acc236",
          "#166a8f",
          "#00a950",
          "#58595b",
          "#8549ba",
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
      },
    ],
  };

  const handleChange = (event) => {
    setSelectedYear(event.target.value);
    generateChartData(event.target.value);
  };

  const generateChartData = (value) => {
    let total = 0;
    const selectedYearChartInfo = allItems.filter(
      (item) => item.month.split("-")[1] === value
    );
    setSeletcedItems(selectedYearChartInfo);
    selectedYearChartInfo.forEach((item) => (total = total + item.total));
    setTotalExpense(total);
  };

  useEffect(() => constructChartInfo(), []);

  const constructChartInfo = () => {
    Axios({ method: "GET", url: getExpenses, headers: headerObj })
      .then((res) => {
        if (res.status === 200) {
          const AllData = res.data.data;
          //   setItems(res.data.data);
          let Months = AllData.map((item) => ({
            month: moment(item.date, "YYYY-MM-DD").format("MMMM"),
            year: moment(item.date, "YYYY-MM-DD").format("YYYY"),
            totalExpense: item.budget,
          }));

          let holder = {};
          Months.forEach(function (d) {
            const keyName = `${d.month}-${d.year}`;
            if (holder.hasOwnProperty(keyName)) {
              holder[keyName] = holder[keyName] + d.totalExpense;
            } else {
              holder[keyName] = d.totalExpense;
            }
          });

          let constructItems = [];
          for (let prop in holder) {
            constructItems.push({ month: prop, total: holder[prop] });
          }

          const Years = [...new Set(Months.map((item) => item.year))];
          setAllItems(constructItems);
          setExpenseYears(Years);
        }
      })
      .catch((e) => {
        console.log("fetchAllRecords Error :", e);
      });
  };

  // Append '4d' to the colors (alpha channel), except for the hovered index
  function handleHover(evt, item, legend) {
    legend.chart.data.datasets[0].backgroundColor.forEach(
      (color, index, colors) => {
        colors[index] =
          index === item.index || color.length === 9 ? color : color + "4D";
      }
    );
    legend.chart.update();
  }

  // Removes the alpha channel from background colors
  function handleLeave(evt, item, legend) {
    legend.chart.data.datasets[0].backgroundColor.forEach(
      (color, index, colors) => {
        colors[index] = color.length === 9 ? color.slice(0, -2) : color;
      }
    );
    legend.chart.update();
  }

  return (
    <Box className="chart-container m-3">
      <Box className={`d-flex justify-content-between align-items-center`}>
        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            bgcolor:
              InitColor === "#ffffff" ? "rgba(0, 0, 0, 0.2)" : "transparent",
          }}
        >
          <ArrowBackIosNewIcon />
        </Button>
      </Box>

      <Select
        fullWidth
        variant="standard"
        name="selectYear"
        value={selectedYear}
        className="mt-3 p-2"
        onChange={handleChange}
        sx={{ color: InitColor }}
      >
        <MenuItem disabled value={selectedYear}>
          <Typography>Select year</Typography>
        </MenuItem>
        {expenseYears?.map((item, i) => (
          <MenuItem key={i} value={item}>
            <Typography>{item}</Typography>
          </MenuItem>
        ))}
      </Select>

      <Stack
        paddingY={3}
        marginY={3}
        sx={{
          bgcolor:
            InitColor === "#ffffff"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.8)",
          borderRadius: "25px",
          display: selectedYear === "Select year" ? "none" : "block",
        }}
      >
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              legend: {
                onHover: handleHover,
                onLeave: handleLeave,
                position: "bottom",
                labels: {
                  boxWidth: 25,
                  boxHeight: 10,
                  boxPadding: 5,
                  borderRadius: 50,
                  color: InitColor,
                  padding: 25,
                },
              },
              title: {
                display: true,
                text: `Expense chart of year ${selectedYear}`,
                color: InitColor,
              },
              subtitle: {
                display: true,
                text: `Total: ₹ ${totalExpense}`,
                padding: { bottom: 10 },
                color: "red",
                font: { weight: "bold" },
              },
              tooltip: {
                callbacks: {
                  label: (item) =>
                    `${item.dataset.label}: ₹ ${item.formattedValue}`,
                },
              },
              datalabels: {
                display: true,
                color: InitColor,
                backgroundColor: "#ccc",
                borderRadius: 3,
                formatter: (value) => "₹ " + value,
                font: { color: "red", weight: "bold" },
              },
            },
          }}
        />
      </Stack>

      <Typography
        variant="h6"
        color={"primary"}
        align="center"
        marginY={10}
        sx={{ display: selectedYear === "Select year" ? "block" : "none" }}
      >
        Select Year to generate chart
      </Typography>
    </Box>
  );
};

export default DoughnutChart;
