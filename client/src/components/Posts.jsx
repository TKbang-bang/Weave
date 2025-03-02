import React, { useEffect, useState } from "react";
import styles from "../styles.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { CommentIcon, Heart, Options, SendIcon, UnHeart, XIcon } from "./svg";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Posts({ to }) {
  const [posts, setPosts] = useState([]);
  const [one, setOne] = useState(false);

  useEffect(() => {
    axios
      .get(`${to}`)
      .then((result) => {
        if (result.data.length == 1) {
          setOne(true);
          setPosts(result.data);
        } else {
          setOne(false);
          setPosts(result.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = () => {};

  const Post = ({ post }) => {
    const [editing, setEditing] = useState(false);
    const [options, setOptions] = useState(false);
    const [editValue, setEditValue] = useState("");

    const handleFollow = (post) => {
      axios.post("/follow", { user_id: post.user_id }).then((result) => {
        if (result.data.ok) {
          if (result.data.followed) {
            posts.find((p) => p.post_id == post.post_id).followed = 1;
          } else {
            posts.find((p) => p.post_id == post.post_id).followed = 0;
          }
          setPosts([...posts]);
        }
      });
    };

    const handleEditTitle = (e) => {
      e.preventDefault();

      axios
        .post("/edit_post", {
          post_id: post.post_id,
          post_title: editValue,
        })
        .then((result) => {
          if (result.data.ok) {
            posts.find((p) => p.post_id == post.post_id).post_title = editValue;
            setPosts([...posts]);
            setEditing(false);
            setOptions(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const handleLike = () => {
      axios.post("/like", { post_id: post.post_id }).then((result) => {
        if (result.data.ok) {
          if (result.data.liked) {
            posts.find((p) => p.post_id == post.post_id).liked = 1;
            posts.find((p) => p.post_id == post.post_id).likes++;
          } else {
            posts.find((p) => p.post_id == post.post_id).liked = 0;
            posts.find((p) => p.post_id == post.post_id).likes--;
          }
          setPosts([...posts]);
        }
      });
    };

    const CommentSection = () => {
      // const [allComments, setAllComments] = useState(posts[0].allComments);
      const [allComments, setAllComments] = useState(posts[0].allComments);
      const [amout, setAmount] = useState(allComments.length);
      const [commentValue, setCommentValue] = useState("");

      useEffect(() => {
        socket.on("server_comment", (data) => {
          setAllComments([data, ...allComments]);
          // posts[0].comments++;
          setCommentValue("");
        });
      }, [socket]);

      const handleSendComment = (e) => {
        e.preventDefault();

        axios
          .get("/user_id")
          .then((result) => {
            socket.emit("client_comment", {
              post_id: post.post_id,
              comment_content: commentValue,
              user_id: result.data.user_id,
            });
          })
          .catch((err) => {
            console.log(err);
          });
      };

      return (
        <>
          <article className={styles.comments_section}>
            {allComments.length > 0 ? (
              allComments.map((comment) => (
                <article className={styles.comment} key={comment.comment_id}>
                  <Link
                    to={`/profile/${comment.user_id}`}
                    className={styles.profile_link}
                  >
                    <img
                      src={
                        comment.user_profile
                          ? `http://localhost:3000/uploads/${comment.user_profile}`
                          : "../../public/no_user.png"
                      }
                      alt=""
                    />
                  </Link>

                  <article className={styles.comment_}>
                    <Link
                      to={`/profile/${comment.user_id}`}
                      className={styles.name_link}
                    >
                      <h3 className={styles.name}>
                        {comment.user_name} {comment.user_lastname}
                      </h3>
                    </Link>

                    <p className={styles.comment_content}>
                      {comment.comment_content}
                    </p>
                  </article>
                </article>
              ))
            ) : (
              <h1 className={styles.no_comments}>No comments yet</h1>
            )}
          </article>

          <form className={styles.comments_form} onSubmit={handleSendComment}>
            <input
              type="text"
              placeholder="Write a comment"
              value={commentValue}
              onChange={(e) => setCommentValue(e.target.value)}
            />
            <button type="submit" className={styles.send}>
              <SendIcon />
            </button>
          </form>
        </>
      );
    };

    return (
      <article className={styles.post}>
        <article className={styles.post_header}>
          <div className={styles.user}>
            <Link to={post.me ? "/myprofile" : `/profile/${post.user_id}`}>
              <img
                src={
                  post.user_profile
                    ? `http://localhost:3000/uploads/${post.user_profile}`
                    : "../../public/no_user.png"
                }
                alt=""
              />
            </Link>

            <Link to={post.me ? "/myprofile" : `/profile/${post.user_id}`}>
              <h3>
                {post.user_name} {post.user_lastname}
              </h3>
            </Link>
          </div>

          {post.me ? (
            <>
              {!editing && (
                <>
                  {options ? (
                    <span onClick={() => setOptions(false)}>
                      <XIcon />
                    </span>
                  ) : (
                    <span onClick={() => setOptions(true)}>
                      <Options />
                    </span>
                  )}

                  {options && (
                    <div className={styles.options}>
                      <p
                        onClick={() => (
                          setOptions(false),
                          setEditing(true),
                          setEditValue(post.post_title)
                        )}
                      >
                        Edit post
                      </p>

                      <p onClick={handleDelete}>Delete post</p>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {post.followed > 0 ? (
                <button
                  className={styles.unfollow}
                  onClick={() => handleFollow(post)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className={styles.follow}
                  onClick={() => handleFollow(post)}
                >
                  Follow
                </button>
              )}
            </>
          )}
        </article>

        {editing ? (
          <form className={styles.edit_form} onSubmit={handleEditTitle}>
            <input
              type="text"
              placeholder="Title"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <button
              className={styles.edit_form_cancel_btn}
              type="button"
              onClick={() => (setEditing(false), setOptions(false))}
            >
              Cancel
            </button>
            <button className={styles.edit_form_edit_btn} type="submit">
              Edit
            </button>
          </form>
        ) : (
          <p className={styles.title}>{post.post_title}</p>
        )}

        <img
          src={"http://localhost:3000/uploads/" + post.post_content}
          className={styles.post_img}
          alt=""
        />

        <p className={styles.date}>{post.since_date}</p>

        <article className={styles.post_footer}>
          {post.liked > 0 ? (
            <span
              className={`${styles.liked} ${styles.like_btn}`}
              onClick={handleLike}
            >
              <Heart />
              <p className={styles.likes_number}>{post.likes}</p>
            </span>
          ) : (
            <span className={styles.like_btn} onClick={handleLike}>
              <UnHeart />
              <p className={styles.likes_number}>{post.likes}</p>
            </span>
          )}

          {!post.comment_section && (
            <Link className={styles.comments_link} to={`/post/${post.post_id}`}>
              <span className={styles.comments_icon_container}>
                <CommentIcon /> Comments
              </span>

              <p className={styles.comments_number}>{post.comments}</p>
            </Link>
          )}
        </article>

        {posts[0].comment_section && <CommentSection />}
      </article>
    );
  };

  return (
    <article className={styles.posts}>
      {posts.map((post) => (
        <Post post={post} key={post.post_id} />
      ))}
    </article>
  );
}

export default Posts;
