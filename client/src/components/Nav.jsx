import React from "react";
import styles from "../styles.module.css";
import { HomeIcon, MessagesIcon, PlusIcon, SearchIcon, UserIcon } from "./svg";
import { NavLink } from "react-router-dom";

function Nav() {
  return (
    <nav className={styles.nav}>
      <form className={styles.search}>
        <input type="text" placeholder="Search" />
        <span>
          <SearchIcon />
        </span>
      </form>

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
            to="/chats"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            <span>
              <MessagesIcon /> Chats
            </span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
