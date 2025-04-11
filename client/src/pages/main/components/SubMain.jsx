import React from "react";
import PostsContainer from "../PostsContainer";
import { Route, Routes } from "react-router-dom";
import Publicate from "../Publicate";
import MyProfile from "../../MyProfile";
import EditProfile from "../../EditProfile";
import SavedPosts from "../../SavedPosts";
import Settings from "../../Settings";
import ChangeName from "../../updates/ChangeName";
import ChangeAlias from "../../updates/ChangeAlias";
import ChangePassword from "../../updates/ChangePassword";
import ChangeEmail from "../../updates/ChangeEmail";

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
        <Route path="/settings/changealias" element={<ChangeAlias />} />
        <Route path="/settings/changepassword" element={<ChangePassword />} />
        <Route path="/settings/changeemail" element={<ChangeEmail />} />
      </Routes>
    </section>
  );
}

export default SubMain;
