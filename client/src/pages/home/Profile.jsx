import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles.module.css";
import Posts from "../../components/Posts";
import { ArrowLeft } from "../../components/svg";

function Profile() {
  const { user_id } = useParams();

  const [user, setUser] = useState({});

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const res = await axios.get(`/user_/${user_id}`);

        if (!res.data.ok) throw new Error(res.response.data.message);

        setUser(res.data.user);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };

    gettingUser();
  }, []);

  const handleFollow = () => {
    axios
      .post("/follow", { user_id: user_id })
      .then((result) => {
        if (result.data.ok) {
          if (result.data.followed) {
            setUser({ ...user, followed: 1 });
          } else {
            setUser({ ...user, followed: 0 });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className={styles.profile}>
      <span className={styles.back} onClick={() => history.back()}>
        <ArrowLeft />
      </span>
      <article className={styles.user}>
        <img
          src={
            user.user_profile
              ? `http://localhost:3000/uploads/${user.user_profile}`
              : `/no_user.png`
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
              : "Follower"}
          </p>
        </div>
      </article>

      {user.followed > 0 ? (
        <button className={styles.unfollow} onClick={handleFollow}>
          Unfollow
        </button>
      ) : (
        <button className={styles.follow} onClick={handleFollow}>
          Follow
        </button>
      )}

      <h3>Posts</h3>
      <Posts to={`/user_posts_/${user_id}`} />
    </section>
  );
}

export default Profile;
