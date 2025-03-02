import axios from "axios";
import React, { use, useEffect, useState } from "react";
import styles from "../../styles.module.css";
import Posts from "../../components/Posts";

function MyProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get("/user")
      .then((result) => {
        result.data.ok && setUser(result.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.profile}>
      <article className={styles.user}>
        <img
          src={
            user.user_profile
              ? `http://localhost:3000/uploads/${user.user_profile}`
              : `../../../public/no_user.png`
          }
          alt=""
        />
        <div className={styles.user_info}>
          <h3>
            {user.user_name} {user.user_lastname}
          </h3>
          <p>{user.followers} Followers</p>
        </div>
      </article>

      <h3>Posts</h3>
      <Posts to={`/user_posts`} />
    </section>
  );
}

export default MyProfile;
