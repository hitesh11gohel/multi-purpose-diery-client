/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Box } from "@mui/system";
import "./doughnutChart.scss";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Doughnut } from "react-chartjs-2";
import { getExpenses } from "../../service";
import Axios from "axios";
import moment from "moment";

const DoughnutChart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  //   const [totalExpense, setTotalExpense] = useState(0);

  const InitColor = localStorage.getItem("themeColor");
  const headerObj = {
    "Access-Control-Allow-Headers": "x-access-token",
    "x-access-token": JSON.parse(localStorage.getItem("loggedIn")).token,
  };
  const chartData = {
    labels: items.map((item) => item.month),
    datasets: [
      {
        label: "Expense",
        data: items.map((item) => item.total),
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
          //   let total = 0;
          for (let prop in holder) {
            // total += holder[prop];
            constructItems.push({ month: prop, total: holder[prop] });
          }
          setItems(constructItems);
          //   setTotalExpense(total);
        }
      })
      .catch((e) => {
        console.log("fetchAllRecords Error :", e);
      });
  };

  return (
    <Box className="chart-container m-3">
      <div className={`d-flex justify-content-between align-items-center`}>
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
      </div>
      <Stack
        paddingY={3}
        marginY={3}
        sx={{
          bgcolor:
            InitColor === "#ffffff"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.8)",
          borderRadius: "25px",
        }}
      >
        <Doughnut
          data={chartData}
          options={{
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  boxWidth: 25,
                  boxHeight: 10,
                  boxPadding: 5,
                  borderRadius: 50,
                },
              },
              title: {
                display: true,
                text: "All expense chart view",
              },
              tooltip: {
                callbacks: {
                  label: (item) =>
                    `${item.dataset.label}: ${item.formattedValue} Rs`,
                },
              },
              //   datalabels: {
              //     display: true,
              //     backgroundColor: "#ccc",
              //     borderRadius: 3,
              //     font: {
              //       color: "red",
              //       weight: "bold",
              //     },
              //   },
              //   doughnutlabel: {
              //     labels: [
              //       {
              //         text: "550",
              //         font: {
              //           size: 20,
              //           weight: "bold",
              //         },
              //       },
              //       {
              //         text: "total",
              //       },
              //     ],
              //   },
            },
          }}
        />
      </Stack>
    </Box>
  );
};

export default DoughnutChart;
