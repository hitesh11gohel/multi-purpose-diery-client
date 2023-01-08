import React, { useEffect } from "react";
import { Box, Card } from "@mui/material";
import "./dashboard.scss";
import AddContent from "../Modals/AddContent";
import Axios from "axios";
import { getExpenses } from "../../service";

const Dashboard = () => {
  const obj = { title: "1" };
  const myData = [obj, obj, obj, obj, obj, obj, obj, obj, obj, obj, obj];

  useEffect(() => {
    // Axios({ url: getExpenses, method: "GET" })
    //   .then((res) => console.log("Response :", res.data))
    //   .catch((e) => console.log("Error : ", e));

    Axios.get(getExpenses)
      .then((res) => console.log("Response :", res.data))
      .catch((e) => console.log("Error : ", e));
  }, []);

  return (
    <Box className="dashboard-container">
      <div>
        {myData.map((_, i) => {
          return (
            <Card
              key={i}
              className="card"
              sx={{ backgroundColor: "#e2e2e2", width: "400px" }}
            >
              <Box className="box-container">
                <div>
                  <p className="data-field title">Infusion</p>
                  <p className="data-field area">SG Highway</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p className="data-field date">01/01/2022</p>
                  <p className="data-field expense">Rs. 9999</p>
                </div>
                {/* <img src="blob:http://localhost:3000/b03b6039-6e44-4bfd-8107-c9b9fb567ae7" alt="okay" width={100} height={100} /> */}
              </Box>
            </Card>
          );
        })}
        <AddContent />
      </div>
    </Box>
  );
};

export default Dashboard;
