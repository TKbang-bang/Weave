import React, { useState } from "react";
import { Image, Trash, Video } from "../../components/svg";

function Publicate() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({ file, title, type });
  };

  return (
    <section className="publicate">
      <form onSubmit={handleSubmit}>
        <h1>Publicate</h1>

        <textarea
          placeholder="Write something..."
          rows={1}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></textarea>

        <div className="file_container">
          {file && (
            <>
              {file.type.includes("image") ? (
                <img src={URL.createObjectURL(file)} alt="file" />
              ) : (
                <video src={URL.createObjectURL(file)} controls />
              )}
            </>
          )}
        </div>

        <div className="btns">
          <input
            type="file"
            id="images_input"
            accept="image/*"
            onChange={(e) => (setFile(e.target.files[0]), setType("image"))}
          />
          <input
            type="file"
            id="videos_input"
            accept="video/*"
            onChange={(e) => (setFile(e.target.files[0]), setType("video"))}
          />
          <label htmlFor="images_input">
            <Image />
          </label>
          <label htmlFor="videos_input">
            <Video />
          </label>
        </div>

        {file && (
          <span onClick={() => (setFile(null), setType(""))} className="del">
            Delete File <Trash />
          </span>
        )}

        <button type="submit" className="btn">
          Publicate
        </button>
      </form>
    </section>
  );
}

export default Publicate;
