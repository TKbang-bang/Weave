import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import styles from "../styles.module.css";
import Nav from "../components/Nav";
import ThisPost from "./home/ThisPost";
import Publicate from "./home/Publicate";

function Principal() {
  return (
    <div className={styles.principal}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publicate" element={<Publicate />} />
        <Route path="/post/:post_id" element={<ThisPost />} />
      </Routes>
    </div>
  );
}

export default Principal;
