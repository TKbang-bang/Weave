const db = require("../../database/db");
const myDate = require("../../configs/date_format");

const usersSearch = async (search, userId) => {
  try {
    const sql = `
        SELECT user_id, user_name, user_lastname, user_profile 
      FROM users 
      WHERE (user_name LIKE ? OR user_lastname LIKE ?) 
      AND user_id != ?
    `;

    const [users] = await db.query(sql, [`${search}%`, `${search}%`, userId]);

    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const postsSearch = async (userId, word) => {
  try {
    const sql = `
        SELECT 
        p.post_id, p.post_title, p.post_content, p.post_date, p.user_id, 
        u.user_name, u.user_lastname, u.user_profile, 
        COUNT(DISTINCT f.from_user_id) AS followed, 
        COUNT(DISTINCT l.user_id) AS likes, 
        COUNT(DISTINCT IF(l.user_id = ?, 1, NULL)) AS liked, 
        COUNT(DISTINCT c.comment_id) AS comments
      FROM posts p
      JOIN users u ON u.user_id = p.user_id
      LEFT JOIN follows f ON f.to_user_id = u.user_id AND f.from_user_id = ?
      LEFT JOIN likes l ON l.post_id = p.post_id
      LEFT JOIN comments c ON c.post_id = p.post_id
      WHERE p.post_title LIKE ?
      GROUP BY p.post_id
      ORDER BY p.post_date DESC
    `;

    const [posts] = await db.query(sql, [userId, userId, `%${word}%`]);

    const today = new Date();
    const dateFormat = "yyyy-MM-dd HH:mm:ss";

    const formattedPosts = posts.map((post) => ({
      ...post,
      since_date: myDate(post.post_date, today, dateFormat),
      me: post.user_id === userId,
      comment_section: false,
    }));

    return { ok: true, posts: formattedPosts };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { usersSearch, postsSearch };
