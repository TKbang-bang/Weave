import React from "react";
import { SearchIcon } from "../../../components/svg";

function Search() {
  return (
    <article className="search">
      <form>
        <input type="text" placeholder="Search..." />
        <button>
          <SearchIcon />
        </button>
      </form>
    </article>
  );
}

export default Search;
