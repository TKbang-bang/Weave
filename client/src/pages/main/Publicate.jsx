import React, { useState } from "react";
import { Image, Trash, Video } from "../../components/svg";
import { Toaster, toast } from "sonner";
import { postingPost } from "../../services/posts";

function Publicate() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await postingPost({ file, title, type });

      if (!res.data.ok) throw new Error(res);

      toast.success(res.data.message);

      setTitle("");
      setFile(null);
      setType("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleChangeImage = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setType("image");
    }
  };

  const handleChangeVideo = (e) => {
    if (e.target.files.length) {
      setFile(e.target.files[0]);
      setType("video");
    }
  };

  const handleDelete = () => {
    setFile(null);
    setType("");
    document.getElementById("images_input").value = "";
    document.getElementById("videos_input").value = "";
    // () => (setFile(null), setType(""))
  };

  return (
    <section className="publicate">
      <form onSubmit={handleSubmit}>
        <h1>Publicate</h1>

        <input
          type="text"
          placeholder="Write something..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />

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
            onChange={handleChangeImage}
          />
          <input
            type="file"
            id="videos_input"
            accept="video/*"
            onChange={handleChangeVideo}
          />
          <label htmlFor="images_input">
            <Image />
          </label>
          <label htmlFor="videos_input">
            <Video />
          </label>
        </div>

        {file && (
          <span onClick={handleDelete} className="del">
            Delete File <Trash />
          </span>
        )}

        <button type="submit" className="btn">
          Publicate
        </button>
      </form>

      {/* <Toaster position="top-center" richColors /> */}
    </section>
  );
}

export default Publicate;
