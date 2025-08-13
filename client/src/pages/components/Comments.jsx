import React from "react";

function Comments({ comments }) {
  return (
    <section className="all_comments">
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <article className="comment" key={comment.id}>
              <img
                src={
                  comment.user.profile
                    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        comment.user.profile
                      }`
                    : `/no_user.png`
                }
                alt=""
              />

              <div className="comment_info">
                <h3>{comment.user.name}</h3>
                <p>{comment.content}</p>
                <span className="date">{comment.since_date}</span>
              </div>
            </article>
          ))}
        </>
      ) : (
        <article className="no_comments">
          <h3>No comments yet</h3>
        </article>
      )}
    </section>
  );
}

export default Comments;
