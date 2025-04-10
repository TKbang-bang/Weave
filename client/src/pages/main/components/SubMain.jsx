import React from "react";
import Search from "./Search";
import PostsContainer from "../PostsContainer";
import { Route, Routes } from "react-router-dom";
import Publicate from "../Publicate";
import MyProfile from "../../MyProfile";
import EditProfile from "../../EditProfile";
import SavedPosts from "../../SavedPosts";
import Settings from "../../Settings";
import ChangeName from "../../updates/ChangeName";

function SubMain() {
  return (
    <section className="sub_main">
      <Routes>
        <Route path="/" element={<PostsContainer />} />
        <Route path="/publicate" element={<Publicate />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/savedposts" element={<SavedPosts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/changename" element={<ChangeName />} />
      </Routes>
    </section>
  );
}

export default SubMain;
