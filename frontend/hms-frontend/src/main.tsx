import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
