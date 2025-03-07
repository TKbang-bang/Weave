import React, { useState } from "react";
import { Eye, EyeSplash } from "../../components/svg";
import styles from "../../styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Password() {
  const [errRes, setErrRes] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seeOld, setSeeOld] = useState(false);
  const [seeNew, setSeeNew] = useState(false);
  const [seeConf, setSeeConf] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrRes("");

    if (newPassword !== confirmPassword) {
      setErrRes("Passwords do not match");
    } else {
      axios
        .post("/change_password", { oldPassword, newPassword })
        .then((res) => {
          if (res.data.ok) {
            navigate("/configuration");
          } else {
            setErrRes(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <section className={styles.publicate}>
      <form className={styles.change_form} onSubmit={handleSubmit}>
        <h1>Change password</h1>
        <div className={styles.password_container}>
          <input
            type={seeOld ? "text" : "password"}
            placeholder="Old password"
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <span onClick={() => setSeeOld(!seeOld)}>
            {seeOld ? <Eye /> : <EyeSplash />}
          </span>
        </div>

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
          Change password
        </button>
      </form>
    </section>
  );
}

export default Password;
