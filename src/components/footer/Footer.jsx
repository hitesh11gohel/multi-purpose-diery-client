import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Footer = () => {
  return (
    <Box className="footer-container">
      <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
        &#169;herry2023
      </Typography>
    </Box>
  );
};

export default Footer;
