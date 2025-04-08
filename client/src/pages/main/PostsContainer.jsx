import React, { useState } from "react";
import Posts from "./components/Posts";
import Search from "./components/Search";

function PostsContainer() {
  const [followingPosts, setFollowingPosts] = useState(false);

  const handleAllPosts = () => {
    document
      .querySelector(".posts_container .posts_nav .all_posts")
      .classList.add("active");
    document
      .querySelector(".posts_container .posts_nav .friends_posts")
      .classList.remove("active");

    setFollowingPosts(false);
  };
  const handleFriendsPosts = () => {
    document
      .querySelector(".posts_container .posts_nav .all_posts")
      .classList.remove("active");
    document
      .querySelector(".posts_container .posts_nav .friends_posts")
      .classList.add("active");

    setFollowingPosts(true);
  };

  return (
    <section className="posts_container">
      <article className="header">
        <Search />
        <ul className="posts_nav">
          <li className="all_posts active" onClick={handleAllPosts}>
            All posts
          </li>
          <li className="friends_posts" onClick={handleFriendsPosts}>
            Following
          </li>
        </ul>
      </article>

      {followingPosts ? (
        <Posts to={"/following_posts"} />
      ) : (
        <Posts to={"/posts"} />
      )}
    </section>
  );
}

export default PostsContainer;
