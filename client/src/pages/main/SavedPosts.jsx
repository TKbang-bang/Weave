import React from "react";
import Posts from "../components/Posts";

function SavedPosts() {
  return (
    <section className="saved_posts">
      <h1 className="title">SavedPosts</h1>

      <Posts to="/posts/saved" />
    </section>
  );
}

export default SavedPosts;
