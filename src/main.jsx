import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

import App from "./App"; // ✅ Use App.js for routing
import "./styles/Teenpati_20.css";
import "./styles/CardComponent.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />  {/* ✅ Add Toaster */}

    <App />
    </BrowserRouter>
  </React.StrictMode>
);
