import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getUserById } from "../../services/usersServices";
import Posts from "../components/Posts";
import { followConfig } from "../../services/activities.service";
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

        if (res.status != 200) throw new Error(res);

        setUser(res.data.user);
        setFollowing(res.data.user.following == 1 ? true : false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    gettingUser();
  }, []);

  const handleFollow = async () => {
    try {
      const res = await followConfig(id);

      if (res.status != 200) throw new Error(res);

      if (res.data.followed) {
        user.followed = 1;
        setFollowing(true);
        user.followers = parseInt(user.followers) + 1;
      } else {
        user.followed = 0;
        setFollowing(false);
        user.followers = parseInt(user.followers) - 1;
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
              user.profile
                ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${user.profile}`
                : "/no_user.png"
            }
            alt={user.name}
          />
        </div>

        <div className="profile_info">
          <h3>{user.name}</h3>
          <p>@{user.alias}</p>
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

      <Posts to={`/posts/user/${id}`} />
    </section>
  );
}

export default Profile;
