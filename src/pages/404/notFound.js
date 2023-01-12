import { Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import NotFound from "../../../src/assets/notFound.png";
import "./notFound.scss";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <Box className="not-found-container text-center">
      <Box
        component={"img"}
        src={NotFound}
        width={"100%"}
        height={400}
        alt="page-not-found"
      ></Box>
      <Button variant="outlined" className="mt-4" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </Box>
  );
};

export default ErrorPage;
