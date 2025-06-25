import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";
import Teenpati_20 from "../pages/Teenpati_20";
import CardGenerator from "../pages/CardGenerator";
import Game from "../pages/Game";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminRegister from "../pages/AdminRegister";
import AdminDashboard from "../pages/AdminDashboard";
import ChangePassword from "../pages/ChangePassword";
import Bets from "../pages/Bets";
import AccountStatement from "../pages/AccountStatement";

const PrivateRoute = ({ element, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!user && !token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/home" />;
  }

  return element;
};

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<PrivateRoute element={<Home />} />} />
      <Route
        path="/teenpatti"
        element={<PrivateRoute element={<Teenpati_20 />} />}
      />
      <Route
        path="/one-card"
        element={<PrivateRoute element={<CardGenerator />} />}
      />
      <Route path="/game" element={<PrivateRoute element={<Game />} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-register" element={<AdminRegister />} />
      <Route path="/account-statement" element={<AccountStatement />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/bets" element={<Bets />} />
      <Route
        path="/admin-dashboard"
        element={<PrivateRoute element={<AdminDashboard />} adminOnly />}
      />
    </Routes>
  );
};

export default Routers;
