import React from "react";
import { useParams } from "react-router-dom";
import Posts from "../../components/Posts";
import styles from "../../styles.module.css";
import { ArrowLeft } from "../../components/svg";

function ThisPost() {
  const { post_id } = useParams();

  return (
    <section className={styles.this_post}>
      <span className={styles.arrow_left} onClick={() => history.back()}>
        <ArrowLeft />
      </span>
      <Posts to={`/post/${post_id}`} />
    </section>
  );
}

export default ThisPost;
