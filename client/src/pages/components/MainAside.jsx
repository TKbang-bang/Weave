import React, { useEffect, useState } from "react";
import { getMyUser, gettingFollowingUsers } from "../../services/usersServices";
import { Toaster, toast } from "sonner";

function MainAside() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const gettingUsers = async () => {
      try {
        const res = await getMyUser();

        if (!res.data.ok) throw new Error(res);

        setUser(res.data.user);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    gettingUsers();
  }, []);

  return (
    <section className="main_aside">
      <article className="user_info">
        <img
          src={
            user.user_profile
              ? `http://localhost:3000/uploads/${user.user_profile}`
              : `/no_user.png`
          }
          alt={user.user_name}
        />
        <h3>{user.user_name}</h3>
        <p className="alias">@{user.user_alias}</p>
        <p className="followers">
          {user.followers} {user.followers == 1 ? "follower" : "followers"}
        </p>
      </article>
    </section>
  );
}

export default MainAside;
