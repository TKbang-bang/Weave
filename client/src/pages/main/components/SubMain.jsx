import React from "react";
import Search from "./Search";
import PostsContainer from "../PostsContainer";
import { Route, Routes } from "react-router-dom";
import Publicate from "../Publicate";

function SubMain() {
  return (
    <section className="sub_main">
      <Routes>
        <Route path="/" element={<PostsContainer />} />
        <Route path="/publicate" element={<Publicate />} />
      </Routes>
    </section>
  );
}

export default SubMain;
