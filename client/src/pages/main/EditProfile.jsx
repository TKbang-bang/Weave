import React, { useEffect, useState } from "react";
import { getMyUser } from "../../services/usersServices";
import { toast, Toaster } from "sonner";
import { ArrowLeft, Image, Trash } from "../../components/svg";
import { Link, useNavigate } from "react-router-dom";
import { changingProfilePicture } from "../../services/updates";

function EditProfile() {
  const [file, setFile] = useState(null);
  const [userFile, setUserFile] = useState(null);
  const [noFile, setNoFile] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const gettingMyUser = async () => {
      try {
        const res = await getMyUser();

        if (!res.data.ok) throw new Error(res);

        setFile(res.data.user.user_profile);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    gettingMyUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (noFile) {
      toast.error("Please select a file");
    } else {
      setNoFile(false);

      const formData = new FormData();
      formData.append("file", userFile);

      try {
        const res = await changingProfilePicture(formData);

        if (!res.data.ok) throw new Error(res);

        setFile(null);
        setNoFile(true);
        document.getElementById("images_input").value = "";

        navigate("/myprofile");
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length) {
      setUserFile(e.target.files[0]);
      setNoFile(false);
    }
  };

  return (
    <section className="edit_profile">
      <Link to={"/myprofile"}>
        <ArrowLeft />
      </Link>
      <form onSubmit={handleSubmit}>
        <h1>Change your profile</h1>

        <div className="file_container">
          {noFile ? (
            <>
              {typeof file == "string" ? (
                <img src={`http://localhost:3000/uploads/${file}`} alt="" />
              ) : (
                <img src="/no_user.png" alt="" />
              )}
            </>
          ) : (
            <img src={URL.createObjectURL(userFile)} alt="" />
          )}
        </div>

        <div className="btns">
          <input
            type="file"
            id="images_input"
            accept="image/*"
            onChange={handleChange}
          />

          <label htmlFor="images_input">
            <Image />
          </label>
        </div>

        {!noFile && (
          <span
            onClick={() => (
              setUserFile(null),
              setNoFile(true),
              (document.getElementById("images_input").value = "")
            )}
            className="del"
          >
            Delete File <Trash />
          </span>
        )}

        <button type="submit" className="btn">
          Save
        </button>
      </form>

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default EditProfile;
