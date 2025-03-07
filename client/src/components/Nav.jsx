import React, { useState } from "react";
import styles from "../styles.module.css";
import {
  GearIcon,
  HomeIcon,
  MessagesIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "./svg";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Nav() {
  const [txt, setTxt] = useState("");

  return (
    <nav className={styles.nav}>
      {/* <form className={styles.search} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search"
          value={txt}
          onChange={(e) => setTxt(e.target.value)}
        />
        <Link to={"/search/" + txt}>
          <SearchIcon />
        </Link>
      </form> */}

      <ul className={styles.nav_links}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span>
              <HomeIcon /> Home
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/myprofile"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span>
              <UserIcon /> Profile
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/publicate"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span>
              <PlusIcon /> Publicate
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span>
              <SearchIcon /> Search
            </span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/configuration"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span>
              <GearIcon /> Configuartion
            </span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
