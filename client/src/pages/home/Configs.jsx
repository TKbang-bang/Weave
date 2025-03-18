import React from "react";
import styles from "../../styles.module.css";
import { Link, useNavigate } from "react-router-dom";
import { DownIcon } from "../../components/svg";
import axios from "axios";

function Configs() {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      await axios.post("/logout");
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete("/delete_account");

      if (!res.data.ok) throw new Error(res.response.data.message);

      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
    }
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
