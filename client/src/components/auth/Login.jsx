import React, { useState } from "react";
import { Eye, EyeSplash } from "../svg";
import { loginData } from "../../services/auth";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [seePassword, setSeePassword] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [emailErrTxt, setEmailErrTxt] = useState("Hello world");
  const [passwordErr, setPasswordErr] = useState(false);
  const [passwordErrTxt, setPasswordErrTxt] = useState("Hola mundo");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailErr(false);
    setEmailErrTxt("");
    setPasswordErr(false);
    setPasswordErrTxt("");

    try {
      const res = await loginData(email, password);

      if (!res.data.ok) throw new Error(res);

      navigate("/");
    } catch (error) {
      if (error.response.data.about == "email") {
        setEmailErr(true);
        setEmailErrTxt(error.response.data.message);
      }

      if (error.response.data.about == "password") {
        setPasswordErr(true);
        setPasswordErrTxt(error.response.data.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Log in</h1>

      <article className="email_field">
        <div className="email_conatainer">
          <label>Email</label>
          <input
            type="email"
            placeholder=" "
            maxLength={40}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {emailErr && <p className="error">*{emailErrTxt}</p>}
      </article>

      <article className="password_field">
        <div className="password_container">
          <label>Password</label>
          <input
            type={seePassword ? "text" : "password"}
            placeholder=" "
            maxLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {seePassword ? (
            <span onClick={() => setSeePassword(false)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeePassword(true)}>
              <EyeSplash />
            </span>
          )}
        </div>

        {passwordErr && <p className="error">*{passwordErrTxt}</p>}
      </article>

      <button type="submit" className="btn">
        Log in
      </button>

      <Link to="/forgotpassword">have you forgotten your password?</Link>
    </form>
  );
}

export default Login;
