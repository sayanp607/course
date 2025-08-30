import App from "./App.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import AdminPanel from "./AdminPanel.jsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Shared API base URL
export const API_BASE_URL = "https://course-xom3.onrender.com";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
