import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/navbar/Header";
import Login from "./auth/login/Login";
import Register from "./auth/register/Regsiter";
import Protected from "./auth/Protected";
import { Box } from "@mui/material";

function App() {
  return (
    <Box className="app-container">
        <Navbar />
        <Routes>
          <Route exec path="/" element={<Protected Component={Dashboard} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </Box>
  );
}

export default App;
