import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { userSearching } from "../../services/search";
import Posts from "./Posts";
import { ArrowLeft } from "../../components/svg";

function Searched() {
  const [users, setUsers] = useState([]);
  const { search } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searching = async () => {
      try {
        const usersSearch = await userSearching(search);

        setUsers(usersSearch.data.users);
      } catch (error) {
        console.log(error);
        // toast.error(error.response.data.message);
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
                <div className="user" key={user.user_id}>
                  <img
                    src={
                      user.user_profile
                        ? `http://localhost:3000/uploads/${user.user_profile}`
                        : `/no_user.png`
                    }
                    alt=""
                  />

                  <p className="followers">
                    {user.followers}{" "}
                    {user.followers == 1 ? "follower" : "followers"}
                  </p>
                  <h3>{user.user_name}</h3>
                  <p className="alias">@{user.user_alias}</p>

                  <Link to={`/profile/${user.user_id}`}>Go to profile</Link>
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
