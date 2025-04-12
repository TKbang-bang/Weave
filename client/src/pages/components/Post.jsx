import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  CommentIcon,
  Heart,
  Options,
  SavedIcon,
  SavedIconfill,
  UnHeart,
} from "../../components/svg";
import {
  deletePost,
  editingTitle,
  followConfig,
  likingPost,
  savingPost,
} from "../../services/activities";

function Post({ post, post_id, del }) {
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState(post.post_title);
  const [liked, setLiked] = useState(post.liked == 1 ? true : false);
  const [likes, setLikes] = useState(post.likes);
  const [showOptions, setShowOptions] = useState(false);
  const [following, setFollowing] = useState(post.followed == 1 ? true : false);
  const [saved, setSaved] = useState(post.saved == 1 ? true : false);

  const handleEdit = async (e) => {
    e.preventDefault();

    if (editValue.endsWith(" "))
      return toast.error("Title cannot end with a space");

    try {
      const res = await editingTitle(post.post_id, editValue);

      if (!res.data.ok) throw new Error(res);

      setEdit(false);
      toast.success("Title updated");

      post.post_title = editValue;

      setShowOptions(false);
    } catch (error) {
      return toast.error(error.response.data.message);
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
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deletePost(post.post_id);

      if (!res.data.ok) throw new Error(res);

      del(post.post_id);

      setShowOptions(false);
      toast.success("Post deleted");
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handleFollow = async () => {
    try {
      const res = await followConfig(post.user_id);

      if (!res.data.ok) throw new Error(res);

      if (res.data.followed) {
        post.followed = 1;
        setFollowing(true);
      } else {
        post.followed = 0;
        setFollowing(false);
      }
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handleSave = async () => {
    try {
      const res = await savingPost(post.post_id);

      if (!res.data.ok) throw new Error(res);

      if (res.data.saved) {
        post.saved = 1;
        setSaved(true);
      } else {
        post.saved = 0;
        setSaved(false);
      }
    } catch (error) {
      return toast.error(error.response.data.message);
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
          <>
            {following ? (
              <button className="unfollow" onClick={handleFollow}>
                Unfollow
              </button>
            ) : (
              <button className="follow" onClick={handleFollow}>
                follow
              </button>
            )}
          </>
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
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Title..."
              maxLength={100}
            />

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
          {saved ? (
            <span className="saved" onClick={handleSave}>
              <SavedIconfill />
            </span>
          ) : (
            <span className="unsaved" onClick={handleSave}>
              <SavedIcon />
            </span>
          )}
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </article>
  );
}

export default Post;
