import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Teenpati_20 from "./pages/Teenpati_20";
import CardGenerator from "./CardGenerator";
import "./App.css";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="teenpatti" element={<Teenpati_20 />} />
        <Route path="one-card" element={<CardGenerator />} />
        <Route path="*" element={<Home />} /> ✅ Add this line
      </Route>
    </Routes>
  );
};

export default App;