import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeSplash,
  SocialIllustration,
  SocialIllustration2,
} from "../../components/svg.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userVerify } from "../../services/usersServices.js";
import styles from "../../styles.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");
  const navigate = useNavigate();

  const [seePassword, setSeePassword] = useState(false);

  useEffect(() => {
    const verifyingUser = async () => {
      const request = await userVerify();

      if (!request.status == 200 || !request.status == 204) {
        return;
      } else {
        navigate("/");
      }
    };

    verifyingUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setFormError(false);
      setErrorMsj("");

      const res = await axios.post("/login", {
        email,
        password,
      });

      if (!res.data.ok) throw new Error(res.response.data.message);

      navigate("/");
    } catch (error) {
      setFormError(true);
      setErrorMsj(error.response.data.message);
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
            type={seePassword ? "tetx" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {seePassword ? (
            <span onClick={() => setSeePassword(!seePassword)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeePassword(!seePassword)}>
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

        <p>
          <Link to={"/recoverpassword"}>Forgot password?</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
