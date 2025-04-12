import React from "react";

function Comments({ comments }) {
  return (
    <section className="all_comments">
      {comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <article className="comment" key={comment.comment_id}>
              <img
                src={
                  comment.user_profile
                    ? `http://localhost:3000/uploads/${comment.user_profile}`
                    : `/no_user.png`
                }
                alt=""
              />

              <div className="comment_info">
                <h3>{comment.user_name}</h3>
                <p>{comment.comment_content}</p>
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
