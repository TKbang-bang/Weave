import React, { useEffect, useState } from "react";
import { Eye, EyeSplash, SocialIllustration } from "../../components/svg.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../styles.module.css";

function Verify() {
  const [formError, setFormError] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(false);
    if (!code || code.length < 1) {
      setFormError(true);
      setErrorMsj("Invalid code");
    } else {
      try {
        axios.post("http://localhost:3000/verify", { code }).then((res) => {
          if (res.data.ok) {
            navigate("/");
          } else {
            setFormError(true);
            setErrorMsj(res.data.message);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.session_form_container}>
      <SocialIllustration />
      <form onSubmit={handleSubmit} className={styles.form_container}>
        <h1>Verify the code</h1>

        <input
          type="text"
          placeholder="Code"
          require="true"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {formError && <p className={styles.error}>{errorMsj}</p>}
        <button type="submit">Verify code</button>
      </form>
    </div>
  );
}

export default Verify;
