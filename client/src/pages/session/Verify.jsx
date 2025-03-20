import React, { useEffect, useState } from "react";
import { Eye, EyeSplash, SocialIllustration } from "../../components/svg.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userVerify } from "../../services/usersServices.js";
import styles from "../../styles.module.css";

function Verify() {
  const [formError, setFormError] = useState(false);
  const [errorMsj, setErrorMsj] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

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
