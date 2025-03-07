import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import styles from "../styles.module.css";
import Nav from "../components/Nav";
import ThisPost from "./home/ThisPost";
import Publicate from "./home/Publicate";
import MyProfile from "./home/MyProfile";
import Profile from "./home/Profile";
import Configs from "./home/Configs";
import ProfilePicture from "./changes/ProfilePicture";
import UserName from "./changes/UserName";
import Code from "./changes/Code";
import UserEmail from "./changes/UserEmail";
import Password from "./changes/Password";
import Searched from "./home/Searched";

function Principal() {
  return (
    <div className={styles.principal}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publicate" element={<Publicate />} />
        <Route path="/post/:post_id" element={<ThisPost />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/profile/:user_id" element={<Profile />} />
        {/* <Route path="/chats/:user_id" element={<Chat />} />
        <Route path="/chats" element={<Chats />} /> */}
        <Route path="/configuration" element={<Configs />} />
        <Route path="/change_profile_picture" element={<ProfilePicture />} />
        <Route path="/change_user_name" element={<UserName />} />
        <Route path="/change_user_email" element={<UserEmail />} />
        <Route path="/code" element={<Code />} />
        <Route path="/change_password" element={<Password />} />
        <Route path="/search" element={<Searched />} />
      </Routes>
    </div>
  );
}

export default Principal;
