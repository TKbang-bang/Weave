import React from "react";
import Posts from "../components/Posts";
import Search from "../components/Search";
import { Routes, Route } from "react-router-dom";
import Searched from "../components/Searched";
import NoRoute from "./NoRoute";

function PostsContainer() {
  return (
    <section className="posts_container">
      <article className="header">
        <Search />
      </article>

      <Routes>
        <Route path="/" element={<Posts to={"/posts"} />} />
        <Route path="/search/:search" element={<Searched />} />

        {/* NOT FOUND */}
        <Route path="*" element={<NoRoute />} />
      </Routes>
    </section>
  );
}

export default PostsContainer;
