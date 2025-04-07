import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import axios from "axios";
import ForgotPassword from "./pages/changes/ForgotPassword";
import Sign from "./pages/auth/Sign";
import Verify from "./pages/auth/Verify";
import { userIsLogged } from "./services/global";
import Display from "./pages/Display";

axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyingUser = async () => {
      try {
        const res = await userIsLogged();

        if (res.status == 204 || res.status == 200 || res.status == 201) return;

        throw new Error(res.response.data.message);
      } catch (error) {
        if (
          window.location == "http://localhost:5173/recoverpassword" ||
          window.location == "http://localhost:5173/verify"
        ) {
          return;
        } else {
          navigate("/sign");
        }
      }
    };

    verifyingUser();
  }, []);

  return (
    <Routes>
      <Route path="/sign" element={<Sign />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="*" element={<Display />} />
      <Route path="/recoverpassword" element={<ForgotPassword />} />
    </Routes>
  );
}

export default App;
