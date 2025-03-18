import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Signup from "./pages/session/Signup";
import Login from "./pages/session/Login";
import Verify from "./pages/session/Verify";
import Principal from "./pages/Principal";
import axios from "axios";
import ForgotPassword from "./pages/changes/ForgotPassword";
import { userVerify } from "./services/usersServices";

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.withCredentials = true;
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyingUser = async () => {
      try {
        const request = await userVerify();

        if (request.status == 200 || request.status == 204) {
          return;
        } else {
          throw new Error(request.data.message);
        }
      } catch (error) {
        if (
          window.location == `http://localhost:5173/signup` ||
          window.location == `http://localhost:5173/recoverpassword` ||
          window.location == "http://localhost:5173/verify"
        ) {
          return;
        } else {
          navigate("/login");
        }
      }
    };

    verifyingUser();
  }, []);

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="*" element={<Principal />} />
      <Route path="/recoverpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
