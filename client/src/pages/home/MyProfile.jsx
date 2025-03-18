import axios from "axios";
import React, { use, useEffect, useState } from "react";
import styles from "../../styles.module.css";
import Posts from "../../components/Posts";

function MyProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const res = await axios.get("/user");

        if (!res.data.ok) throw new Error(res.response.data.message);

        setUser(res.data.user);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    gettingUser();
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
          <p>
            {user.followers}{" "}
            {user.followers > 1 || user.followers < 1
              ? "Followers"
              : " Follower"}
          </p>
        </div>
      </article>

      <h3>Posts</h3>
      <Posts to={`/user_posts`} />
    </section>
  );
}

export default MyProfile;
