import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  GearIcon,
  HomeIcon,
  PlusIcon,
  Saved,
  UserIcon,
} from "../../../components/svg";

function Nav() {
  return (
    <div className="nav">
      <Link to="/" className="logo">
        <img src="/weave.png" alt="" /> <p>Weave</p>
      </Link>

      <ul className="nav_links">
        <li>
          <NavLink to={"/"}>
            <HomeIcon />
            <p>Home</p>
          </NavLink>
        </li>

        <li>
          <NavLink to={"/myprofile"}>
            <UserIcon />
            <p>My Profile</p>
          </NavLink>
        </li>

        <li>
          <NavLink to={"/publicate"}>
            <PlusIcon />
            <p>Publicate</p>
          </NavLink>
        </li>

        <li>
          <NavLink to={"/saved"}>
            <Saved />
            <p>Saved</p>
          </NavLink>
        </li>

        <li>
          <NavLink to={"/settings"}>
            <GearIcon />
            <p>Settings</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
