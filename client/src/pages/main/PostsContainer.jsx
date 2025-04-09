import React, { useState } from "react";
import Posts from "./components/Posts";
import Search from "./components/Search";

function PostsContainer() {
  const [followingPosts, setFollowingPosts] = useState(false);

  return (
    <section className="posts_container">
      <article className="header">
        <Search />
      </article>

      <Posts to={"/posts"} />
    </section>
  );
}

export default PostsContainer;
