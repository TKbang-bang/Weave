import React, { useState, useEffect } from "react";
import { Eye, EyeSplash } from "../../components/svg";
import styles from "../../styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [errRes, setErrRes] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [errRes2, setErrRes2] = useState("");
  const [seeNew, setSeeNew] = useState(false);
  const [seeConf, setSeeConf] = useState(false);
  const [emailed, setEmailed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/user_verify")
      .then((res) => {
        if (res.data.ok) {
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrRes("");

    if (newPassword !== confirmPassword) {
      setErrRes("Passwords do not match");
    } else {
      axios
        .post("/code_password", { password: newPassword, code })
        .then((res) => {
          if (res.data.ok) {
            navigate("/login");
          } else {
            setErrRes(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleEmail = (e) => {
    e.preventDefault();

    setErrRes2("");

    if (email === "") {
      setErrRes2("Email is required");
      return;
    }

    axios.post("/email_forgot_password", { email }).then((res) => {
      if (res.data.ok) {
        setErrRes2("");
        setEmailed(true);
      } else {
        setErrRes2(res.data.message);
      }
    });
  };

  return (
    <section className={styles.fgpass}>
      {emailed ? (
        <form className={styles.change_form} onSubmit={handleSubmit}>
          <h1>We sent a code to your email</h1>

          <input
            type="text"
            placeholder="Write the code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <div className={styles.password_container}>
            <input
              type={seeNew ? "text" : "password"}
              placeholder="New password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span onClick={() => setSeeNew(!seeNew)}>
              {seeNew ? <Eye /> : <EyeSplash />}
            </span>
          </div>

          <div className={styles.password_container}>
            <input
              type={seeConf ? "text" : "password"}
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span onClick={() => setSeeConf(!seeConf)}>
              {seeConf ? <Eye /> : <EyeSplash />}
            </span>
          </div>

          {errRes && <p className={styles.error}>{errRes}</p>}

          <button type="submit" className={styles.submit}>
            Send code
          </button>
        </form>
      ) : (
        <form className={styles.change_form} onSubmit={handleEmail}>
          <h1>Insert your email</h1>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errRes2 && <p className={styles.error}>{errRes2}</p>}

          <button type="submit" className={styles.submit}>
            Send email
          </button>
        </form>
      )}
    </section>
  );
}

export default ForgotPassword;
