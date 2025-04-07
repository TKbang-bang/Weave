import React from "react";
import NavMain from "./components/NavMain";
import PagesDisplay from "./components/PagesDisplay";
import { Route, Routes } from "react-router-dom";
import Posts from "./components/PostsContainer";

function Main() {
  return (
    <div className="main_router">
      <Routes>
        <Route path="/" element={<Posts />} />
      </Routes>
    </div>
  );
}

export default Main;
