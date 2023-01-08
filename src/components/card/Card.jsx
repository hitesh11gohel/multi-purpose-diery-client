import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";

const CardComp = ({ children }) => {
  return (
    <Box className="card-container">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item>
          <Paper sx={{ textAlign: "center", borderRadius: "15px" }}>
            {children}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CardComp;
