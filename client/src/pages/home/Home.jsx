import React, { useEffect } from "react";
import styles from "../../styles.module.css";
import axios from "axios";

function Home() {
  useEffect(() => {
    axios
      .get("/posts")
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.home}>
      <article className={styles.home_header}>
        <h1>Sync up</h1>
        <p>Share with everybody</p>
      </article>

      <article className={styles.posts}></article>

      <article className={styles.home_footer}>
        <h1>Follow more users for more posts</h1>
        <p>Follow more users for more posts</p>
        <h1>Sync Up</h1>
      </article>
    </section>
  );
}

export default Home;
