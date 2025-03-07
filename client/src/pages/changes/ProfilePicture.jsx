import React, { useEffect, useState } from "react";
import styles from "../../styles.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusIcon, RepeatIcon } from "../../components/svg";

function ProfilePicture() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [noFile, setNoFile] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setNoFile(false);
      setErrorMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (noFile) {
      setErrorMessage("Please select a file");
    } else {
      setNoFile(false);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("file", file);

      axios
        .post("/change_profile_picture", formData)
        .then((res) => navigate("/configuration"))
        .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    axios
      .get("/user_profile")
      .then((res) => {
        setFile(res.data.user.user_profile);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className={styles.publicate}>
      <form className={styles.change_form} onSubmit={handleSubmit}>
        <h1>Change profile picture</h1>
        <input
          type="file"
          id="my_file"
          className={styles.my_file}
          accept="image/*"
          onChange={handleChange}
        />

        {file ? (
          <>
            {typeof file == "string" ? (
              <div className={styles.image_display}>
                <img src={"http://localhost:3000/uploads/" + file} alt="" />
                <label htmlFor="my_file" className="img_label">
                  <RepeatIcon /> Change file
                </label>
              </div>
            ) : (
              <div className={styles.image_display}>
                <img src={URL.createObjectURL(file)} alt="" />
                <label htmlFor="my_file" className="img_label">
                  <RepeatIcon /> Change file
                </label>
              </div>
            )}
          </>
        ) : (
          <label htmlFor="my_file" className={styles.file_label}>
            <PlusIcon />
          </label>
        )}

        {errorMessage && (
          <div className={styles.error_message}>
            <p>*{errorMessage}</p>
          </div>
        )}

        <button type="submit" className={styles.submit}>
          Change picture
        </button>
      </form>
    </section>
  );
}

export default ProfilePicture;
