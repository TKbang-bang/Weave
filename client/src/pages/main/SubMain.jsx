import React from "react";
import PostsContainer from "./PostsContainer";
import { Route, Routes } from "react-router-dom";
import Publicate from "./Publicate";
import MyProfile from "./MyProfile";
import EditProfile from "./EditProfile";
import SavedPosts from "./SavedPosts";
import Settings from "./Settings";
import ChangeName from "../updates/ChangeName";
import ChangeAlias from "../updates/ChangeAlias";
import ChangePassword from "../updates/ChangePassword";
import ChangeEmail from "../updates/ChangeEmail";
import Profile from "./Profile";

function SubMain() {
  return (
    <section className="sub_main">
      <Routes>
        <Route path="*" element={<PostsContainer />} />
        <Route path="/publicate" element={<Publicate />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/savedposts" element={<SavedPosts />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/settings/update/name" element={<ChangeName />} />
        <Route path="/settings/update/alias" element={<ChangeAlias />} />
        <Route path="/settings/update/password" element={<ChangePassword />} />
        <Route path="/settings/update/email" element={<ChangeEmail />} />
      </Routes>
    </section>
  );
}

export default SubMain;
