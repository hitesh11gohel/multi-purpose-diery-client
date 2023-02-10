import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/navbar/Header";
import Footer from "./components/footer/Footer";
import Login from "./auth/login/Login";
import Register from "./auth/register/Regsiter";
import Protected from "./auth/Protected";
import ExpenseDetails from "./pages/expense-details/expense-details";
import NotFound from "./pages/404/notFound";
import { Box } from "@mui/material";
import Profile from "./pages/profile/Profile";
import DoughnutChart from "./pages/charts/DoughnutChart";

function App() {
  const InitColor = localStorage.getItem("themeColor");
  const [themeColor, setThemeColor] = useState(InitColor ? InitColor : "#000");
  const themeColorFromChild = (value) => setThemeColor(value);
  const theme = createTheme({
    palette: { primary: { main: themeColor }, secondary: { main: "#2a9461" } },
    typography: {
      fontFamily: "Alegreya Sans SC",
      h6: { fontSize: "24px" },
      body1: { fontSize: "18px" },
      body2: { fontSize: "16px" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-container">
        <Navbar fromChild={themeColorFromChild} />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route exec path="/">
            <Route path="" element={<Protected Component={Dashboard} />} />
            <Route
              path="expense-detail/:id"
              element={<Protected Component={ExpenseDetails} />}
            />
          </Route>
          <Route path="/profile" element={<Protected Component={Profile} />} />
          <Route
            path="/chart"
            element={<Protected Component={DoughnutChart} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
