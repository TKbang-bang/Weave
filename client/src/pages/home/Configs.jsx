import React from "react";
import styles from "../../styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { DownIcon } from "../../components/svg";
import axios from "axios";

function Configs() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    axios.post("/logout").then(() => navigate("/login"));
  };
  const handleDelete = () => {
    axios
      .delete("/delete_account")
      .then((res) => {
        if (res.data.ok) {
          navigate("/login");
        } else {
          console.log(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <section className={styles.configs}>
      <article className={styles.config}>
        <div className={styles.config_header}>
          <h3>User edits</h3>
        </div>

        <ul className={styles.config_list}>
          <li>
            <Link to="/change_profile_picture">Change profile picture</Link>
          </li>
          <li>
            <Link to="/change_user_name">Change name</Link>
          </li>
          <li>
            <Link to="/change_user_email">Change email</Link>
          </li>
          <li>
            <Link to="/change_password">Change password</Link>
          </li>
        </ul>
      </article>

      <article className={styles.config}>
        <div className={styles.config_header}>
          <h3>Session</h3>
        </div>

        <ul className={styles.config_list}>
          <li>
            <button onClick={handleLogOut}>Log out</button>
          </li>
          <li>
            <button onClick={handleDelete}>Delete account</button>
          </li>
        </ul>
      </article>
    </section>
  );
}

export default Configs;
