import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App";
import "./styles/Teenpati_20.css";
import "./styles/CardComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import BalanceProvider from "./context/BalanceContext";
import AuthProvider from "./context/AuthContext"; // ✅ Default import
import "./lib/axiosInterceptor";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {" "}
        {/* ✅ Wrap inside AuthProvider */}
        <BalanceProvider>
          <ToastContainer
            position="top-center"
            autoClose={2500}
            limit={2}
            closeOnClick
            pauseOnHover={false}
            draggable
            newestOnTop
            // theme="colored"
          />

          <App />
        </BalanceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
