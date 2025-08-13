import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "sonner";
import Comments from "./Comments";
import Post from "./Post";
import { CloseIcon, SendIcon } from "../../components/svg";
import { gettingPosts, gettingComments } from "../../services/posts.service";
import { getAccessToken, verifyToken } from "../../services/token.service";
import { SocketContext } from "../Display";

function Posts({ to }) {
  const [posts, setPosts] = useState([]);
  const [post_id, setPostId] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const socket = useContext(SocketContext);

  useEffect(() => {
    const getPostst = async () => {
      try {
        const res = await gettingPosts({ link: to });

        if (res.status != 200) throw new Error(res);

        setPosts(res.data);
      } catch (error) {
        return toast.error(error.response.data.message);
      }
    };

    getPostst();
  }, [to]);

  useEffect(() => {
    const newComment = (data) => {
      setAllComments((prev) => {
        const exists = prev.some((comment) => comment.id === data.id);
        if (exists) return prev;
        return [data, ...prev];
      });
      setCommentValue("");
      setPosts((prev) =>
        prev.map((post) =>
          parseInt(post.id) == parseInt(data.postId)
            ? { ...post, comments: parseInt(post.comments) + 1 }
            : post
        )
      );
    };

    socket.on("server_comment", newComment);

    const serverError = ({ message }) => {
      toast.error(message);
    };

    socket.on("server_error", serverError);

    return () => {
      socket.off("server_comment", newComment);
      socket.off("server_error", serverError);
    };
  }, [socket]);
  const handleCommenting = async (e) => {
    e.preventDefault();

    try {
      let token = getAccessToken();

      if (!token) {
        const res = await verifyToken();

        if (res.status != 200) throw new Error(res);
        if (!res.headers["access-token"]) throw new Error("Token not found");

        token = res.headers["access-token"].split(" ")[1];
      }

      return socket.emit("client_comment", {
        postId: post_id,
        content: commentValue,
        token,
      });
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  const handlePostId = async (id) => {
    try {
      setPostId(id);

      const res = await gettingComments(id);
      if (res.status != 200) throw new Error(res);

      setAllComments(res.data.comments);
      document.querySelector(".comments_section").classList.remove("hide");
    } catch (error) {
      return toast.error(error.response.data.message);
    }
  };

  return (
    <section className="posts">
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              post_id={(id) => handlePostId(id)}
              del={(id) =>
                setPosts((prev) => prev.filter((post) => post.id != id))
              }
            />
          ))}

          <article className="comments_section hide">
            <div className="coments_container">
              <button
                className="close"
                onClick={() => (
                  document
                    .querySelector(".comments_section")
                    .classList.add("hide"),
                  setPostId(""),
                  setAllComments([]),
                  setCommentValue("")
                )}
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
        </>
      ) : (
        <section className="no_posts">
          <h1>No posts found</h1>
          <p>Make the first move</p>
          <Link to={"/publicate"}>Publicate</Link>
        </section>
      )}
    </section>
  );
}

export default Posts;
