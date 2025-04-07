import React from "react";
import { NavLink } from "react-router-dom";
import { GearIcon, HomeIcon, PlusIcon, UserIcon } from "./svg";

function SideBarNav() {
  return (
    <aside className="sidenav">
      <ul className="nav_links">
        <li>
          <NavLink to={"/"}>
            <p>Home</p>
            <HomeIcon />
          </NavLink>
        </li>
        <li>
          <NavLink to={"/profile"}>
            <p>Profile</p>
            <UserIcon />
          </NavLink>
        </li>
        <li>
          <NavLink to={"/publicate"}>
            <p>Publicate</p>
            <PlusIcon />
          </NavLink>
        </li>
        <li>
          <NavLink to={"/options"}>
            <p>Options</p>
            <GearIcon />
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}

export default SideBarNav;
