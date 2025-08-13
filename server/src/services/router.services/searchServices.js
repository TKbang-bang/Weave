const myDate = require("../../utils/date_format");
const { User, Post, sequelize } = require("../../../models");
const { Op } = require("sequelize");

const usersSearch = async (search, userId) => {
  try {
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { alias: { [Op.like]: `%${search}%` } },
        ],
        id: { [Op.ne]: userId },
      },
    });

    return users;
  } catch (error) {
    throw new Error(error);
  }
};

const postsSearch = async (userId, search) => {
  try {
    const posts = await Post.findAll({
      where: {
        title: { [Op.like]: `%${search}%` },
      },
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

module.exports = { usersSearch, postsSearch };
