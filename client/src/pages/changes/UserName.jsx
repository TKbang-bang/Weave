import React, { useEffect, useState } from "react";
import styles from "../../styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSplash, PlusIcon, RepeatIcon } from "../../components/svg";

function UserName() {
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [see, setSee] = useState(false);
  const [errRes, setErrRes] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const gettinName = async () => {
      try {
        const res = await axios.get("/user");

        setName(res.data.user.user_name);
        setLastname(res.data.user.user_lastname);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    gettinName();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrRes("");

    try {
      const res = await axios.post("/change_name", {
        name,
        lastname,
        password,
      });

      if (!res.data.ok) throw new Error(res.response.data.message);

      navigate("/configuration");
    } catch (error) {
      setErrRes(error.response.data.message);
    }
  };

  return (
    <section className={styles.publicate}>
      <form className={styles.change_form} onSubmit={handleSubmit}>
        <h1>Change name</h1>
        <input
          type="text"
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
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

export default UserName;
