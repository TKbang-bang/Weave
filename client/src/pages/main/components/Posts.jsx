import React, { useEffect, useState } from "react";
import { gettingPosts } from "../../../services/posts";
import Post from "./Post";
import { CloseIcon, SendIcon } from "../../../components/svg";
import Comments from "./Comments";
import { Toaster, toast } from "sonner";
import { getUserId } from "../../../services/usersServices";
import io from "socket.io-client";
import { gettingComments } from "../../../services/activities";

const socket = io("http://localhost:3000");

function Posts({ to }) {
  const [posts, setPosts] = useState([]);
  const [post_id, setPostId] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    const getPostst = async () => {
      const res = await gettingPosts({ link: to });
      setPosts(res.data.posts);
    };
    getPostst();
  }, [to]);

  useEffect(() => {
    const newComment = (data) => {
      setAllComments((prev) => {
        const exists = prev.some(
          (comment) => comment.comment_id === data.comment_id
        );
        if (exists) return prev;
        return [data, ...prev];
      });
      setCommentValue("");

      setPosts((prev) =>
        prev.map((post) =>
          post.post_id == post_id
            ? { ...post, comments: post.comments + 1 }
            : post
        )
      );
    };

    socket.off("server_comment", newComment);
    socket.on("server_comment", newComment);

    socket.on("server_error", (errTxt) => {
      toast.error(errTxt);
    });
  }, [socket]);

  const handleCommenting = async (e) => {
    e.preventDefault();
    try {
      const res = await getUserId();

      if (!res.data.ok) throw new Error(res);

      const getId = await res.data.user_id;

      socket.emit("client_comment", {
        post_id: post_id,
        comment_content: commentValue,
        user_id: getId,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handlePostId = async (id) => {
    try {
      setPostId(id);

      const res = await gettingComments(id);
      setAllComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }

    document.querySelector(".comments_section").classList.remove("hide");
  };

  return (
    <section className="posts">
      {posts.map((post) => (
        <Post
          key={post.post_id}
          post={post}
          post_id={(id) => handlePostId(id)}
          del={(id) =>
            setPosts((prev) => prev.filter((post) => post.post_id != id))
          }
          err={(errTxt) => toast.error(errTxt)}
          sucs={(sucsTxt) => toast.success(sucsTxt)}
        />
      ))}

      <article className="comments_section hide">
        <div className="coments_container">
          <button
            className="close"
            onClick={() =>
              document.querySelector(".comments_section").classList.add("hide")
            }
          >
            <CloseIcon />
          </button>

          <Comments comments={allComments} />

          <form onSubmit={handleCommenting}>
            <input
              type="text"
              placeholder="Comment..."
              onChange={(e) => setCommentValue(e.target.value)}
              value={commentValue}
            />
            <button type="submit">
              <SendIcon />
            </button>
          </form>
        </div>
      </article>

      <Toaster position="top-center" richColors />
    </section>
  );
}

export default Posts;
