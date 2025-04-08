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

  return (
    <section className="publicate">
      <form onSubmit={handleSubmit}>
        <h1>Publicate</h1>

        <textarea
          placeholder="Write something..."
          rows={1}
          limit={500}
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

      <Toaster position="top-center" richColors />
    </section>
  );
}

export default Publicate;
