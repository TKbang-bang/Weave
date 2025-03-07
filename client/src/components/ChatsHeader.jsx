import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles.module.css";
import { SearchIcon, XIcon } from "./svg";

function ChatsHeader() {
  const [txt, setTxt] = useState("");
  const [users, setUsers] = useState([]);
  const [searchErr, setSearchErr] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearched(true);

    axios
      .get("/user_search/" + txt)
      .then((res) => {
        if (res.data.ok) {
          setUsers(res.data.users);
          setSearchErr(false);
        } else {
          setSearchErr(true);
          setErrMsg(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <article className={styles.chats_header}>
      <form className={styles.chats_search_form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search users"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <button type="submit">
          <SearchIcon />
        </button>
      </form>

      {searched && (
        <div className={`${styles.search_results}`}>
          <span
            className={styles.Chats_close}
            onClick={() => setSearched(false)}
          >
            <XIcon />
          </span>
          {searchErr ? (
            <h1 className={styles.search_results_error}>{errMsg}</h1>
          ) : (
            <section className={styles.search_results_list}>
              {users.map((user) => (
                <Link key={user.user_id} to={"/chats/" + user.user_id}>
                  <img
                    src={
                      user.user_profile
                        ? "http://localhost:3000/uplaods/" + user.user_profile
                        : "../../../public/no_user.png"
                    }
                    alt={user.user_name}
                  />
                  <h3>
                    {user.user_name} {user.user_lastname}
                  </h3>
                </Link>
              ))}
            </section>
          )}
        </div>
      )}
    </article>
  );
}

export default ChatsHeader;
