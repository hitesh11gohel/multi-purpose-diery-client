import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/navbar/Header";
import Login from "./auth/login/Login";
import Register from "./auth/register/Regsiter";
import Protected from "./auth/Protected";
import { Box } from "@mui/material";
import ExpenseDetails from "./pages/expense-details/expense-details";
import NotFound from "./pages/404/notFound";

function App() {
  return (
    <Box className="app-container">
      <Navbar />
      <Routes>
        {/* <Route exec path="/" element={<Protected Component={Dashboard} />}> */}
        <Route path="*" element={<NotFound />} />
        <Route exec path="/">
          <Route path="" element={<Protected Component={Dashboard} />} />
          <Route
            path="expense-detail/:id"
            element={<Protected Component={ExpenseDetails} />}
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Box>
  );
}

export default App;
