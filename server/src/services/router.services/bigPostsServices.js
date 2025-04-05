const myDate = require("../../configs/date_format");
const db = require("../../database/db");

const getAllPosts = async (userId) => {
  try {
    const sql = `
    SELECT 
        p.post_id, p.post_title, p.post_content, p.post_date, 
        p.user_id, u.user_name, u.user_alias, u.user_profile,
        COUNT(DISTINCT f.follow_id) AS followed,
        COUNT(DISTINCT l1.like_id) AS likes,
        COUNT(DISTINCT l2.like_id) AS liked,
        COUNT(DISTINCT c.comment_id) AS comments
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN follows f ON f.from_user_id = ? AND f.to_user_id = u.user_id
      LEFT JOIN likes l1 ON l1.post_id = p.post_id
      LEFT JOIN likes l2 ON l2.user_id = ? AND l2.post_id = p.post_id
      LEFT JOIN comments c ON c.post_id = p.post_id
      GROUP BY p.post_id, p.post_title, p.post_content, p.post_date, 
      p.user_id, u.user_name, u.user_alias, u.user_profile
      ORDER BY p.post_date DESC
  `;

    const [posts] = await db.query(sql, [userId, userId]);

    const dateFormat = "yyyy-MM-dd HH:mm:ss";
    const today = new Date();

    const newPosts = posts.map((post) => ({
      ...post,
      since_date: myDate(post.post_date, today, dateFormat),
      me: post.user_id == userId,
      comment_section: false,
    }));

    return newPosts;
  } catch (error) {
    throw new Error(error);
  }
};

const getPostById = async (userId, postId) => {
  const sql = `
    SELECT 
        p.post_id, p.post_title, p.post_content, p.post_date, 
        p.user_id, u.user_name, u.user_alias, u.user_profile,
        COUNT(DISTINCT f.follow_id) AS followed,
        COUNT(DISTINCT l1.like_id) AS likes,
        COUNT(DISTINCT l2.like_id) AS liked,
        COUNT(DISTINCT c.comment_id) AS comments
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN follows f ON f.from_user_id = ? AND f.to_user_id = u.user_id
      LEFT JOIN likes l1 ON l1.post_id = p.post_id
      LEFT JOIN likes l2 ON l2.user_id = ? AND l2.post_id = p.post_id
      LEFT JOIN comments c ON c.post_id = p.post_id
      WHERE p.post_id = ?
      GROUP BY p.post_id, p.post_title, p.post_content, p.post_date, 
      p.user_id, u.user_name, u.user_alias, u.user_profile
      ORDER BY p.post_date DESC
  `;

  const [posts] = await db.query(sql, [userId, userId, postId]);
  if (posts.length == 0) return null;

  const dateFormat = "yyyy-MM-dd HH:mm:ss";
  const today = new Date();

  return {
    ...posts[0],
    since_date: myDate(posts[0].post_date, today, dateFormat),
    me: posts[0].user_id == userId,
    comment_section: true,
  };
};

const getCommentsByPostId = async (postID) => {
  const sql = `
    SELECT 
      comment_id, comment_content, post_id, user_name, user_alias, user_profile 
    FROM comments c 
    JOIN users u ON u.user_id = c.user_id 
    WHERE post_id = ?
  `;
  const [comments] = await db.query(sql, [postID]);
  return comments;
};

const getUserPosts = async (myId, userId) => {
  try {
    const sql = `
    SELECT 
      p.post_id, p.post_title, p.post_content, p.post_date, 
      p.user_id, u.user_name, u.user_alias, u.user_profile,
      COUNT(DISTINCT f.follow_id) AS followed,
      COUNT(DISTINCT l1.like_id) AS likes,
      COUNT(DISTINCT l2.like_id) AS liked,
      COUNT(DISTINCT c.comment_id) AS comments
    FROM posts p
    JOIN users u ON u.user_id = p.user_id
    LEFT JOIN follows f ON f.from_user_id = ? AND f.to_user_id = u.user_id
    LEFT JOIN likes l1 ON l1.post_id = p.post_id
    LEFT JOIN likes l2 ON l2.user_id = ? AND l2.post_id = p.post_id
    LEFT JOIN comments c ON c.post_id = p.post_id
    WHERE p.user_id = ?
    GROUP BY p.post_id, p.post_title, p.post_content, p.post_date, 
      p.user_id, u.user_name, u.user_alias, u.user_profile
    ORDER BY p.post_date DESC;
  `;
    const [posts] = await db.query(sql, [myId, myId, userId]);

    const dateFormat = "yyyy-MM-dd HH:mm:ss";
    const today = new Date();

    return posts.map((post) => ({
      ...post,
      since_date: myDate(post.post_date, today, dateFormat),
      me: post.user_id == myId,
      comment_section: false,
    }));
  } catch (error) {
    throw new Error("Database has failde", error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getCommentsByPostId,
  getUserPosts,
};
