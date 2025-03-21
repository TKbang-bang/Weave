import React, { useState, useEffect } from "react";
import { Eye, EyeSplash, SocialIllustration } from "../../components/svg.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userVerify } from "../../services/usersServices.js";
import styles from "../../styles.module.css";

function Signup() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");
  const navigate = useNavigate();

  const [seePassword, setSeePassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

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
      if (password !== confirmPassword) {
        setFormError(true);
        setErrorMsj("Passwords do not match");
        return;
      } else {
        setFormError(false);
        setErrorMsj("");

        const res = await axios.post("/signup", {
          name,
          lastname,
          email,
          password,
        });

        if (!res.data.ok) {
          throw new Error(res.response.data.message);
        }

        navigate("/verify");
      }
    } catch (error) {
      setFormError(true);
      setErrorMsj(`${error.response.data.message}`);
    }
  };

  return (
    <div className={styles.session_form_container}>
      <SocialIllustration />
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Create account</h1>

        <div className={styles.name_container}>
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Lastname"
            required
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles.password_container}>
          <input
            type={seePassword ? "text" : "password"}
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

        <div className={styles.confirm_password_container}>
          <input
            type={seeConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {seeConfirmPassword ? (
            <span onClick={() => setSeeConfirmPassword(!seeConfirmPassword)}>
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSeeConfirmPassword(!seeConfirmPassword)}>
              <EyeSplash />
            </span>
          )}
        </div>
        {formError && <p className={styles.error}>{errorMsj}</p>}

        <button type="submit">Create account</button>

        <p className={styles.arlready_have_account}>
          Already have an account? <Link to={"/login"}>Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
