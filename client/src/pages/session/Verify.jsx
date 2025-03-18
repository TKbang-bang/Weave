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

  // useEffect(() => {
  //   const sendCode = await axios
  //   axios
  //     .get("/user_verify")
  //     .then((res) => {
  //       if (res.data.ok) {
  //         navigate("/");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(false);
    if (!code || code.length < 1) {
      setFormError(true);
      setErrorMsj("Invalid code");
    } else {
      try {
        const sendCode = await axios.post("http://localhost:3000/verify", {
          code,
        });

        if (!sendCode.data.ok) {
          throw new Error(sendCode.response.data.message);
        }

        navigate("/");
      } catch (error) {
        setFormError(true);
        setErrorMsj(error.response.data.message);
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
