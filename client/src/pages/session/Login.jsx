import React, { useState } from "react";
import {
  Eye,
  EyeSplash,
  SocialIllustration,
  SocialIllustration2,
} from "../../components/svg.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");
  const navigate = useNavigate();

  const [seePassword, setSeePassword] = useState(false);

  const handleSeePassword = () => {
    if (seePassword) {
      document.querySelector(
        ".session_form_container form .password_container  input"
      ).type = "password";
      setSeePassword(false);
    } else {
      document.querySelector(
        ".session_form_container form .password_container  input"
      ).type = "text";
      setSeePassword(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      setFormError(false);
      setErrorMsj("");

      axios
        .post("http://localhost:3000/login", {
          email,
          password,
        })
        .then((res) => {
          res.data.ok
            ? navigate("/")
            : (setFormError(true), setErrorMsj(res.data.message));
          // console.log(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.session_form_container}>
      <SocialIllustration2 />
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Log in</h1>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles.password_container}>
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {seePassword ? (
            <span onClick={handleSeePassword}>
              <Eye />
            </span>
          ) : (
            <span onClick={handleSeePassword}>
              <EyeSplash />
            </span>
          )}
        </div>

        {formError && <p className={styles.error}>{errorMsj}</p>}

        <button type="submit">Log in</button>

        <p className={styles.arlready_have_account}>
          You don't have an account yet?{" "}
          <Link to={"/signup"}>Create account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
