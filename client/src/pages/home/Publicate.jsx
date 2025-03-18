import React, { useState } from "react";
import styles from "../../styles.module.css";
import { PlusIcon, RepeatIcon } from "../../components/svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Publicate() {
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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setErrorMessage("");

      if (noFile) {
        setErrorMessage("Please select a file");
      } else {
        setNoFile(false);
        setErrorMessage("");

        const formData = new FormData();
        formData.append("title", title);
        formData.append("file", file);

        const publicating = await axios.post("/publicate", formData);

        if (!publicating.data.ok) {
          throw new Error(publicating.response.data.message);
        }

        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <section className={styles.publicate}>
      <form onSubmit={handleSubmit}>
        <h1>What's new</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="file"
          id="my_file"
          className={styles.my_file}
          accept="image/*"
          onChange={handleChange}
        />

        {file ? (
          <div className={styles.image_display}>
            <img src={URL.createObjectURL(file)} alt="" />
            <label htmlFor="my_file" className="img_label">
              <RepeatIcon /> Change file
            </label>
          </div>
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

        <button className={styles.submit} type="submit">
          Publicate
        </button>
      </form>
    </section>
  );
}

export default Publicate;
