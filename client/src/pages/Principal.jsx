import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import styles from "../styles.module.css";
import Nav from "../components/Nav";
import Publicate from "./home/Publicate";

function Principal() {
  return (
    <div className={styles.principal}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/publicate" element={<Publicate />} />
      </Routes>
    </div>
  );
}

export default Principal;
