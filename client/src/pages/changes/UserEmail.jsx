import React, { useEffect, useState } from "react";
import styles from "../../styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSplash } from "../../components/svg";

function UserEmail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [see, setSee] = useState(false);
  const [errRes, setErrRes] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrRes("");

    axios.post("/change_email", { email, password }).then((res) => {
      if (res.data.ok) {
        navigate("/code");
      } else {
        setErrRes(res.data.message);
      }
    });
  };

  return (
    <section className={styles.publicate}>
      <form className={styles.change_form} onSubmit={handleSubmit}>
        <h1>Change name</h1>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className={styles.password_container}>
          <input
            type={see ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {see ? (
            <span onClick={() => setSee(false)}>
              {" "}
              <Eye />
            </span>
          ) : (
            <span onClick={() => setSee(true)}>
              {" "}
              <EyeSplash />
            </span>
          )}
        </div>

        {errRes && <p className={styles.err}>{errRes}</p>}

        <button type="submit" className={styles.submit}>
          Change name
        </button>
      </form>
    </section>
  );
}

export default UserEmail;
