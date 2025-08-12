const myDate = require("../../configs/date_format");
const db = require("../../database/db");
const { User, Post, sequelize, Comment, Save } = require("../../../models");
const { user } = require("../../configs/database_config");

const getAllPosts = async (userId) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "media",
        "media_type",
        "createdAt",
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")'
          ),
          "likes",
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'
          ),
          "comments",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Saves" WHERE "Saves"."postId" = "Post"."id" AND "Saves"."userId" = '${userId}')`
          ),
          "saved",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id" AND "Likes"."userId" = '${userId}')`
          ),
          "liked",
        ],
      ],
      include: [
        {
          model: User,
          as: "owner",
          attributes: [
            "id",
            "name",
            "alias",
            "profile",
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."fromUser" = '${userId}' AND "Follows"."toUser" = "owner"."id")`
              ),
              "following",
            ],
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      group: ["Post.id", "owner.id"],
    });

    const newPosts = posts.map((post) => {
      {
        const plainPosts = post.get({ plain: true });

        return {
          ...plainPosts,
          since_date: myDate(plainPosts.createdAt),
          me: plainPosts.owner.id == userId,
          comment_section: false,
        };
      }
    });

    return newPosts;
  } catch (error) {
    throw new Error(error);
  }
};

const getPostById = async (userId, postId) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "media",
        "media_type",
        "createdAt",
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")'
          ),
          "likes",
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'
          ),
          "comments",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Saves" WHERE "Saves"."postId" = "Post"."id" AND "Saves"."userId" = '${userId}')`
          ),
          "saved",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id" AND "Likes"."userId" = '${userId}')`
          ),
          "liked",
        ],
      ],
      where: {
        id: postId,
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: [
            "id",
            "name",
            "alias",
            "profile",
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."fromUser" = '${userId}' AND "Follows"."toUser" = "owner"."id")`
              ),
              "following",
            ],
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      group: ["Post.id", "owner.id"],
    });

    const newPosts = posts.map((post) => {
      {
        const plainPosts = post.get({ plain: true });

        return {
          ...plainPosts,
          since_date: myDate(plainPosts.createdAt),
          me: plainPosts.owner.id == userId,
          comment_section: true,
        };
      }
    });

    return newPosts;
  } catch (error) {
    throw new Error(error);
  }
};

const getCommentsByPostId = async (postId) => {
  try {
    const comments = await Comment.findAll({
      where: {
        postId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "alias", "profile"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const newComments = comments.map((comment) => {
      {
        const plainComments = comment.get({ plain: true });
        return {
          ...plainComments,
          since_date: myDate(plainComments.createdAt),
        };
      }
    });

    return newComments;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserPosts = async (myId, userId) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "media",
        "media_type",
        "createdAt",
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")'
          ),
          "likes",
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'
          ),
          "comments",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Saves" WHERE "Saves"."postId" = "Post"."id" AND "Saves"."userId" = '${myId}')`
          ),
          "saved",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id" AND "Likes"."userId" = '${myId}')`
          ),
          "liked",
        ],
      ],
      where: {
        userId,
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: [
            "id",
            "name",
            "alias",
            "profile",
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."fromUser" = '${myId}' AND "Follows"."toUser" = "owner"."id")`
              ),
              "following",
            ],
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      group: ["Post.id", "owner.id"],
    });

    const newPosts = posts.map((post) => {
      {
        const plainPosts = post.get({ plain: true });

        return {
          ...plainPosts,
          since_date: myDate(plainPosts.createdAt),
          me: plainPosts.owner.id == myId,
          comment_section: false,
        };
      }
    });

    return newPosts;
  } catch (error) {
    throw new Error(error);
  }
};

const savedPosts = async (userId) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "media",
        "media_type",
        "createdAt",
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id")'
          ),
          "likes",
        ],
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Comments" WHERE "Comments"."postId" = "Post"."id")'
          ),
          "comments",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Saves" WHERE "Saves"."postId" = "Post"."id" AND "Saves"."userId" = '${userId}')`
          ),
          "saved",
        ],
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM "Likes" WHERE "Likes"."postId" = "Post"."id" AND "Likes"."userId" = '${userId}')`
          ),
          "liked",
        ],
      ],
      include: [
        {
          model: Save,
          as: "saves",
          where: {
            userId,
          },
        },
        {
          model: User,
          as: "owner",
          attributes: [
            "id",
            "name",
            "alias",
            "profile",
            [
              sequelize.literal(
                `(SELECT COUNT(*) FROM "Follows" WHERE "Follows"."fromUser" = '${userId}' AND "Follows"."toUser" = "owner"."id")`
              ),
              "following",
            ],
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      group: ["Post.id", "owner.id", "saves.id"],
    });

    const newPosts = posts.map((post) => {
      {
        const plainPosts = post.get({ plain: true });

        return {
          ...plainPosts,
          since_date: myDate(plainPosts.createdAt),
          me: plainPosts.owner.id == userId,
          comment_section: false,
        };
      }
    });

    return newPosts;
    //   const sql = `
    //   SELECT
    //     p.post_id, p.post_title, p.post_media, p.post_media_type, p.post_date,
    //     p.user_id, u.user_name, u.user_alias, u.user_profile,
    //     COUNT(DISTINCT f.follow_id) AS followed,
    //     COUNT(DISTINCT l1.like_id) AS likes,
    //     COUNT(DISTINCT l2.like_id) AS liked,
    //     COUNT(DISTINCT c.comment_id) AS comments,
    //     COUNT(DISTINCT s.saved_id) AS saved
    //   FROM posts p
    //   JOIN users u ON u.user_id = p.user_id
    //   LEFT JOIN follows f ON f.from_user_id = ? AND f.to_user_id = u.user_id
    //   LEFT JOIN likes l1 ON l1.post_id = p.post_id
    //   LEFT JOIN likes l2 ON l2.user_id = ? AND l2.post_id = p.post_id
    //   LEFT JOIN comments c ON c.post_id = p.post_id
    //   LEFT JOIN saved s ON s.user_id = ? AND s.post_id = p.post_id
    //   WHERE s.user_id = ?
    //   GROUP BY p.post_id, p.post_title, p.post_media, p.post_media_type, p.post_date,
    //     p.user_id, u.user_name, u.user_alias, u.user_profile
    //   ORDER BY p.post_date DESC;
    // `;
    //   const [posts] = await db.query(sql, [userId, userId, userId, userId]);
    //   const dateFormat = "yyyy-MM-dd HH:mm:ss";
    //   const today = new Date();
    //   return posts.map((post) => ({
    //     ...post,
    //     since_date: myDate(post.post_date, today, dateFormat),
    //     me: post.user_id == userId,
    //     comment_section: false,
    //   }));
  } catch (error) {
    console.log(error);
    throw new Error("Database has failde", error);
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  getCommentsByPostId,
  getUserPosts,
  savedPosts,
};
