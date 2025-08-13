import React, { useEffect, useState } from "react";
import { getMyUser } from "../../services/usersServices";
import { toast } from "sonner";
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

        if (res.status != 200) throw new Error(res);

        setUser(res.data.user);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    gettingUser();
  }, []);

  const handleDelete = async () => {
    if (!user.profile || user.profile == null)
      return toast.error("You don't have a profile picture");

    toast("Are you sure you want to delete your profile picture?", {
      action: {
        label: "Yes, delete",
        onClick: async () => {
          try {
            const res = await deletingProfilePicture();

            if (res.status != 204) throw new Error(res.response.data.message);

            setImageDelete(true);
            toast.success("Profile picture deleted");
          } catch (error) {
            toast.error(error.response.data.message);
          }
        },
      },
    });
  };

  return (
    <section className="profile">
      <article className="profile_header">
        <div className="image_container">
          <img
            src={
              imageDelete || !user.profile
                ? `/no_user.png`
                : `${import.meta.env.VITE_BACKEND_URL}/uploads/${user.profile}`
            }
            alt={user.name}
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
          <h3>{user.name}</h3>
          <p>@{user.alias}</p>
          <p>
            {user.followers} {user.followers == 1 ? "follower" : "followers"}
          </p>
        </div>
      </article>

      <Posts to={`/posts/me`} />
    </section>
  );
}

export default MyProfile;
