import React, { useEffect, useState } from "react";
import { getMyUser } from "../../services/usersServices";
import { Toaster, toast } from "sonner";
import { PlusIcon } from "../../components/svg";
import Posts from "../components/Posts";
import { Link } from "react-router-dom";
import { deletingProfilePicture } from "../../services/updates";

function MyProfile() {
  const [user, setUser] = useState({});
  const [profileOptions, setProfileOptions] = useState(false);
  const [imageDelete, setImageDelete] = useState(false);

  useEffect(() => {
    const gettingUser = async () => {
      try {
        const res = await getMyUser();

        if (!res.data.ok) throw new Error(res);

        setUser(res.data.user);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    gettingUser();
  }, []);

  const handleDelete = async () => {
    try {
      const res = await deletingProfilePicture();

      if (!res.data.ok) throw new Error(res.response.data.message);

      setImageDelete(true);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="profile">
      <article className="profile_header">
        <div className="image_container">
          <img
            src={
              imageDelete || !user.user_profile
                ? `/no_user.png`
                : `http://localhost:3000/uploads/${user.user_profile}`
            }
            alt=""
          />

          <button
            className="plus"
            onClick={() => setProfileOptions(!profileOptions)}
          >
            <PlusIcon />
          </button>

          {profileOptions && (
            <div className="profile_options">
              <Link className="edit" to="/editprofile">
                Edit profile
              </Link>
              <button className="delete" onClick={handleDelete}>
                Delete profile
              </button>
            </div>
          )}
        </div>

        <div className="profile_info">
          <h3>{user.user_name}</h3>
          <p>@{user.user_alias}</p>
          <p>
            {user.followers} {user.followers == 1 ? "follower" : "followers"}
          </p>
        </div>
      </article>

      <Posts to={`/user_posts`} />

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default MyProfile;
