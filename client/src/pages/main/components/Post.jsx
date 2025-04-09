import React, { useState } from "react";
import {
  CommentIcon,
  Heart,
  Options,
  Saved,
  UnHeart,
} from "../../../components/svg";
import { Link } from "react-router-dom";
import {
  deletePost,
  editingTitle,
  likingPost,
} from "../../../services/activities";
import { Toaster, toast } from "sonner";

function Post({ post, post_id, del, err, sucs }) {
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(post.post_title);
  const [liked, setLiked] = useState(post.liked == 1 ? true : false);
  const [likes, setLikes] = useState(post.likes);
  const [showOptions, setShowOptions] = useState(false);

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const res = await editingTitle(post.post_id, editValue);

      if (!res.data.ok) throw new Error(res);

      setEdit(false);
      toast.success("Title updated");

      post.post_title = editValue;

      setShowOptions(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleLike = async () => {
    try {
      const res = await likingPost(post.post_id);

      if (!res.data.ok) throw new Error(res);

      if (res.data.liked) {
        setLiked(true);
        setLikes(likes + 1);
      } else {
        setLiked(false);
        setLikes(likes - 1);
      }

      //   console.log(res);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deletePost(post.post_id);

      if (!res.data.ok) throw new Error(res);

      del(post.post_id);

      setShowOptions(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <article className="post">
      <div className="post_header">
        <Link to={`/profile/${post.user_id}`} className="post_profile">
          <img
            src={
              post.user_profile
                ? `http://localhost:3000/uploads/${post.user_profile}`
                : `/no_user.png`
            }
            alt=""
          />
        </Link>

        <div className="post_info">
          <Link
            to={post.me ? "/myprofile" : `/profile/${post.user_id}`}
            className="name"
          >
            {post.user_name}
          </Link>
          <p className="date">{post.since_date}</p>
        </div>

        {post.me ? (
          <>
            {!edit && (
              <div
                className="post_options"
                onClick={() => setShowOptions(true)}
              >
                <Options />
              </div>
            )}
          </>
        ) : (
          <button className="follow">
            {post.followed ? "Unfollow" : "Follow"}
          </button>
        )}

        {!edit && showOptions && (
          <div className="options">
            <button
              className="edit"
              onClick={() => (
                document.querySelector(".options").classList.add("hide"),
                setEdit(true)
              )}
            >
              Edit
            </button>
            <button className="delete" onClick={handleDelete}>
              Delete
            </button>
            <button className="cancel" onClick={() => setShowOptions(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {edit && (
        <div className="edit_container">
          <form onSubmit={handleEdit}>
            <textarea
              rows={1}
              value={editValue}
              maxLength={500}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Title..."
            ></textarea>

            <div className="btns">
              <button className="save" type="submit">
                Save
              </button>
              <button
                className="cancel"
                onClick={() => (
                  setEdit(false),
                  setEditValue(post.post_title),
                  setShowOptions(false)
                )}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="post_content">
        {!edit && <p className="post_title">{post.post_title}</p>}
        {post.post_media_type === "image" ? (
          <img
            className="file"
            src={`http://localhost:3000/uploads/${post.post_media}`}
            alt=""
            loading="lazy"
          />
        ) : (
          <video controls className="file" loading="lazy">
            <source src={`http://localhost:3000/uploads/${post.post_media}`} />
          </video>
        )}
      </div>

      <div className="post_footer">
        <div className="likes">
          {liked ? (
            <span className="liked" onClick={handleLike}>
              <Heart />
            </span>
          ) : (
            <span className="unlike" onClick={handleLike}>
              <UnHeart />
            </span>
          )}
          <p>{likes}</p>
        </div>

        <div className="comments" onClick={() => post_id(post.post_id)}>
          <span>
            <CommentIcon />
          </span>
          <p>{post.comments}</p>
        </div>

        <div className="saved">
          <span>
            <Saved />
          </span>
          {/* <p>Saved</p> */}
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </article>
  );
}

export default Post;
