import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import { getUserById } from "../../services/usersServices";
import Posts from "../components/Posts";
import { followConfig } from "../../services/activities";
import { ArrowLeft } from "../../components/svg";

function Profile() {
  const [user, setUser] = useState({});
  const [following, setFollowing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const res = await getUserById(id);

        if (!res.data.ok) throw new Error(res);

        setUser(res.data.user);
        setFollowing(res.data.user.followed == 1 ? true : false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    gettingUser();
  }, []);

  const handleFollow = async () => {
    try {
      const res = await followConfig(id);

      if (!res.data.ok) throw new Error(res);

      if (res.data.followed) {
        user.followed = 1;
        setFollowing(true);
        user.followers += 1;
      } else {
        user.followed = 0;
        setFollowing(false);
        user.followers -= 1;
      }
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  return (
    <section className="profile">
      <button className="back" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>
      <article className="profile_header">
        <div className="image_container">
          <img
            src={
              user.user_profile
                ? `http://localhost:3000/uploads/${user.user_profile}`
                : "/no_user.png"
            }
            alt={user.user_name}
          />
        </div>

        <div className="profile_info">
          <h3>{user.user_name}</h3>
          <p>@{user.user_alias}</p>
          <p>
            {user.followers} {user.followers == 1 ? "follower" : "followers"}
          </p>
        </div>

        {following ? (
          <button className="unfollow" onClick={handleFollow}>
            Unfollow
          </button>
        ) : (
          <button className="follow" onClick={handleFollow}>
            Follow
          </button>
        )}
      </article>

      <Posts to={`/user_posts_/${id}`} />

      <Toaster position="top-center" richColors />
    </section>
  );
}

export default Profile;
