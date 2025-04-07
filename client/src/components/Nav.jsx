import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  const [searchTxt, setSearchTxt] = React.useState("");

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <img src="/weave.png" alt="" />
        <p>Weave</p>
      </Link>

      <form>
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </form>
    </nav>
  );
}

export default Nav;
