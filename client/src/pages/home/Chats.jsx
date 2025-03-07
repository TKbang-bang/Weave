import React, { useEffect, useState } from "react";
import styles from "../../styles.module.css";
import { SearchIcon, XIcon } from "../../components/svg";
import axios from "axios";
import { Link } from "react-router-dom";
import ChatsHeader from "../../components/ChatsHeader";

function Chats() {
  const [users, setUsers] = useState([]);
  const [reqErr, setReqErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    axios
      .get("/mychats")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.chats}>
      <ChatsHeader />

      <article className={styles.chats_list}>
        <h1>List</h1>
      </article>
    </section>
  );
}

export default Chats;
