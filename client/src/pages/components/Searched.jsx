import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { userSearching } from "../../services/search";
import Posts from "./Posts";
import { ArrowLeft } from "../../components/svg";
import { toast } from "sonner";

function Searched() {
  const [users, setUsers] = useState([]);
  const { search } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searching = async () => {
      try {
        const usersSearch = await userSearching(search);

        if (usersSearch.status != 200) throw new Error(usersSearch);

        setUsers(usersSearch.data.users);
      } catch (error) {
        return toast.error(error.response.data.message);
      }
    };

    searching();
  }, [search]);

  return (
    <section className="searched">
      <button onClick={() => navigate(-1)} className="back">
        <ArrowLeft />
      </button>
      <article className="users">
        <h3>Users</h3>

        {users.length > 0 ? (
          <div className="users_container">
            {users.map((user) => {
              return (
                <div className="user" key={user.id}>
                  <img
                    src={
                      user.profile
                        ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                            user.profile
                          }`
                        : `/no_user.png`
                    }
                    alt=""
                  />

                  <p className="followers">
                    {user.followers}{" "}
                    {user.followers == 1 ? "follower" : "followers"}
                  </p>
                  <h3>{user.name}</h3>
                  <p className="alias">@{user.alias}</p>

                  <Link to={`/profile/${user.id}`}>Go to profile</Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="users_container">
            <div className="user">
              <img src="/no_user.png" alt="" />
              <h3>No user</h3>
            </div>
          </div>
        )}
      </article>

      <article className="posts_">
        <h3>Posts</h3>
        <Posts to={`/posts_search_by_word/${search}`} />
      </article>
    </section>
  );
}

export default Searched;
