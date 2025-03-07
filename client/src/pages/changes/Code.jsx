import axios from "axios";
import React, { useState } from "react";
import styles from "../../styles.module.css";
import { useNavigate } from "react-router-dom";

function Code() {
  const [errRes, setErrRes] = useState("");
  const [code, setCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrRes("");
    axios
      .post("/change_email_code", { code })
      .then((res) => {
        if (res.data.ok) {
          navigate("/configuration");
        } else {
          setErrRes(res.data.message);
        }
      })

      .catch((err) => {
        setErrRes(err.response.data.msg);
      });
  };

  return (
    <section className={styles.publicate}>
      <form className={styles.change_form} onSubmit={handleSubmit}>
        <h1>Code Verification</h1>
        <input
          type="txt"
          placeholder="Code"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {errRes && <p className={styles.err}>{errRes}</p>}

        <button type="submit" className={styles.submit}>
          Verificate Code
        </button>
      </form>
    </section>
  );
}

export default Code;
