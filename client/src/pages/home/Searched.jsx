import React, { useEffect, useState } from "react";
import { ArrowLeft } from "../../components/svg";
import { useParams, Link } from "react-router-dom";
import styles from "../../styles.module.css";
import axios from "axios";
import Posts from "../../components/Posts";

function Searched() {
  const [users, setUsers] = useState([]);
  const [txt, setTxt] = useState("");
  const [to, setTo] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setTo(txt);

    try {
      const res = await axios.get("/user_search/" + txt);
      if (!res.data.ok) throw new Error(res.data.message);

      setUsers(res.data.users);
      setSearched(true);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <section className={styles.searched}>
      <span className={styles.arrow_left} onClick={() => history.back()}>
        <ArrowLeft />
      </span>

      {searched ? (
        <>
          <form className={styles.search_form} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search"
              value={txt}
              onChange={(e) => setTxt(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className={styles.results}>
            <h1>Users</h1>
            <article className={styles.users}>
              {users.length > 0 ? (
                users.map((user) => (
                  <div className={styles.user} key={user.user_id}>
                    <img
                      src={
                        user.user_profile
                          ? `http://localhost:3000/uploads/${user.user_profile}`
                          : `../../../public/no_user.png`
                      }
                      alt="profile"
                    />
                    <h3>
                      {user.user_name} {user.user_lastname}
                    </h3>

                    <Link to={`/profile/${user.user_id}`}>See profile</Link>
                  </div>
                ))
              ) : (
                <div className={styles.user}>
                  <img src={`../../../public/no_user.png`} alt="profile" />
                  <h3>Not found</h3>
                </div>
              )}
            </article>

            <h1>Posts</h1>
            <Posts to={"/user_posts_by_word/" + to} />
          </div>
        </>
      ) : (
        <form className={styles.search_form} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={txt}
            onChange={(e) => setTxt(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}
    </section>
  );
}

export default Searched;
