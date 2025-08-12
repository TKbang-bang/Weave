import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import io from "socket.io-client";
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
  const [editValue, setEditValue] = useState(post.title);
  const [liked, setLiked] = useState(post.liked == 1 ? true : false);
  const [likes, setLikes] = useState(post.likes);
  const [showOptions, setShowOptions] = useState(false);
  const [following, setFollowing] = useState(
    post.owner.following == 1 ? true : false
  );
  const [saved, setSaved] = useState(post.saved == 1 ? true : false);

  const handleEdit = async (e) => {
    e.preventDefault();

    if (editValue.endsWith(" "))
      return toast.error("Title cannot end with a space");

    try {
      const res = await editingTitle(post.id, editValue);

      if (res.status != 204) throw new Error(res);

      setEdit(false);
      toast.success("Title updated");

      post.title = editValue;

      setShowOptions(false);
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handleLike = async () => {
    try {
      const res = await likingPost(post.id);

      if (res.status != 200) throw new Error(res);

      if (res.data.liked) {
        setLiked(true);
        setLikes(parseInt(likes) + 1);
      } else {
        setLiked(false);
        setLikes(parseInt(likes) - 1);
      }
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handleDelete = () => {
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Yes, delete",
        onClick: async () => {
          try {
            const res = await deletePost(post.id);

            if (res.status != 204) throw new Error(res.data.message);

            del(post.id);
            setShowOptions(false);
            toast.success("Post deleted");
          } catch (error) {
            const message =
              error.response?.data?.message || "Failed to delete the post";
            return toast.error(message);
          }
        },
      },
    });
  };
  const handleFollow = async () => {
    try {
      const res = await followConfig(post.owner.id);

      if (res.status != 200) throw new Error(res);

      if (res.data.followed) {
        post.owner.following = 1;
        setFollowing(true);
      } else {
        post.owner.following = 0;
        setFollowing(false);
      }
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handleSave = async () => {
    try {
      const res = await savingPost(post.id);

      if (res.status != 200) throw new Error(res);

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
        <Link
          to={post.me ? "/myprofile" : `/profile/${post.owner.id}`}
          className="post_profile"
        >
          <img
            src={
              post.owner.profile
                ? `http://localhost:3000/uploads/${post.owner.profile}`
                : `/no_user.png`
            }
            alt=""
          />
        </Link>

        <div className="post_info">
          <Link
            to={post.me ? "/myprofile" : `/profile/${post.userId}`}
            className="name"
          >
            {post.owner.name}
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
              <span
                className="cancel"
                onClick={() => (
                  setEdit(false),
                  setEditValue(post.title),
                  setShowOptions(false)
                )}
              >
                Cancel
              </span>
            </div>
          </form>
        </div>
      )}

      <div className="post_content">
        {!edit && <p className="post_title">{post.title}</p>}
        {post.media_type === "image" ? (
          <img
            className="file"
            src={`http://localhost:3000/uploads/${post.media}`}
            alt=""
            loading="lazy"
          />
        ) : (
          <video controls className="file" loading="lazy">
            <source src={`http://localhost:3000/uploads/${post.media}`} />
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

        <div className="comments" onClick={() => post_id(post.id)}>
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

      {/* <Toaster position="top-center" richColors duration={3000} /> */}
    </article>
  );
}

export default Post;
