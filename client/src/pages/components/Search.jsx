import React from "react";
import { SearchIcon } from "../../components/svg";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

function Search() {
  const [search, setSearch] = React.useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!search || search == "")
      return toast.error("Search cannot be empty"), e.preventDefault();
    if (search.endsWith(" "))
      return toast.error("Search cannot end with a space"), e.preventDefault();
    if (window.location.pathname == `/search/${search}`) return;

    navigate(`/search/${search}`);
  };

  return (
    <article className="search">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">
          <SearchIcon />
        </button>
      </form>
    </article>
  );
}

export default Search;
