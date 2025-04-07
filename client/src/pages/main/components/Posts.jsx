import React, { useEffect } from "react";
import { gettingPosts } from "../../../services/posts";

function Posts({ to }) {
  useEffect(() => {
    const getPostst = async () => {
      const res = await gettingPosts({ link: to });

      console.log(res);
    };

    getPostst();
  }, [to]);

  return (
    <section className="posts">
      <h1>Posts {to}</h1>
    </section>
  );
}

export default Posts;
