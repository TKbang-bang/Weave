import React, { useEffect, useState } from "react";
import { getMyUser, gettingFollowingUsers } from "../../services/usersServices";
import { Toaster, toast } from "sonner";

function MainAside() {
  const [user, setUser] = useState({});

  useEffect(() => {
    const gettingUsers = async () => {
      try {
        const res = await getMyUser();

        if (res.status != 200) throw new Error(res);

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
            user.profile
              ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${user.profile}`
              : `/no_user.png`
          }
          alt={user.name}
        />
        <h3>{user.name}</h3>
        <p className="alias">@{user.alias}</p>
        <p className="followers">
          {user.followers} {user.followers == 1 ? "follower" : "followers"}
        </p>
      </article>
    </section>
  );
}

export default MainAside;
