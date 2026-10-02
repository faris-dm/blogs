import express from "express";
import "dotenv/config";
import Auth from "../middle/auth.js";
import Pool from "../config/db.js";
const router = express.Router();

router.get("/posts/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    //  the id is id of the post
    // const {commentOwner}=req.user.id

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid post id",
      });
    }
    const GetPostid = await Pool.query(
      `SELECT users.username,users.id,comments.post_id,comments.content,comments.created_at
      FROM users
      JOIN comments ON users.id=comments.user_id
      WHERE comments.post_id=$1
      ORDER BY  comments.created_at`,
      [id]
    );
    const rows = GetPostid.rows.length;
    if (rows === 0) {
      return res.status(404).json({
        success: "false",
        message: `there is no comments under post id ${id} id`,
      });
    }
    return res.status(200).json({
      success: true,
      data: GetPostid.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal Server error");
  }
});

router.post("/posts/:id/comments", Auth, async (req, res) => {
  try {
    const { id } = req.params;
    //  the id used to get specif post
    const userId = req.user.id;
    //  the userId is used to get the user  who posted
    const { content } = req.body;
    //   adn this is the content of the post
    if (isNaN(id) || content === "") {
      return res.status(400).json("Please insert valid id");
    }

    const checkPostExist = await Pool.query(
      ` SELECT content FROM posts WHERE id=$1`,
      [id]
    );

    if (checkPostExist.rows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: " post does not exits" });
    }

    const addComment = await Pool.query(
      `INSERT INTO comments (post_id,content,user_id) VALUES ($1,$2,$3) RETURNING *`,
      [id, content, userId]
    );

    return res.status(200).json({
      success: true,
      message: "comment added successfully",
      data: addComment.rows[0],
    });
  } catch (error) {
    console.error("Fetch single Orders Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

//  the put is working put it need fix

router.put("/comments/:commentId/edit", Auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const UserId = req.user.id;
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "invalid inputs" });
    }
    const updateComment = await Pool.query(
      `UPDATE comments SET content=$1 WHERE id=$2 AND user_id=$3 RETURNING *`,
      [content, commentId, UserId]
    );

    if (updateComment.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "comment does not exist" });
    }

    return res.status(200).json({ success: true, data: updateComment.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
});
router.delete("/comments/:ids", Auth, async (req, res) => {
  try {
    const { ids } = req.params;
    const userId = req.user.id;

    const GetPostid = await Pool.query(
      ` SELECT *  FROM  comments  WHERE post_id=$1 `,
      [ids]
    );
    const rows = GetPostid.rows.length;
    if (rows === 0) {
      return res.status(404).json({
        success: false,
        message: `there is no comments under post id ${ids} id`,
      });
    }

    const DeleteComment = await Pool.query(
      `DELETE FROM comments WHERE id=$1 AND user_id=$2  RETURNING *`,
      [ids, userId]
    );
    const Rows = DeleteComment.rows.length;
    if (Rows === 0) {
      return res.status(404).json({
        success: false,
        message: `there is no comments  with ${ids}  `,
      });
    }
    return res.status(200).json({
      success: true,
      message: "comments deleted succefully",
      data: DeleteComment.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal server error");
  }
});

//  this is followe  routes
router.get("/allFollowers", async (req, res) => {
  try {
    const GetAllFolloer = await Pool.query(
      ` SELECT *  FROM follows ORDER BY id DESC `
    );
    if (GetAllFolloer.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "there is no follower avaliable for now",
      });
    }
    return res.status(200).json({
      success: true,
      data: GetAllFolloer.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});

router.post("/follow/:followed_user", Auth, async (req, res) => {
  try {
    const { followed_user } = req.params;
    const follower = req.user.id;
    if (Number(followed_user) === follower) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }

    const CheckUserExist = await Pool.query(
      `
          SELECT * FROM users WHERE  id=$1
          `,
      [followed_user]
    );

    if (CheckUserExist.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "there is no user with this accounts",
      });
    }

    const followUser = await Pool.query(
      `
    INSERT INTO  follows (follower_id,followed_id) VALUES($1,$2) RETURNING *
    `,
      [follower, followed_user]
    );

    if (followUser.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "user account does not  exist" });
    }

    // if (followed_user === follower) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "invalid request" });
    // }
    return res.status(200).json({
      success: true,
      message: "you are  following this account  successfully",
      data: followUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});

router.delete("/unfollow/:followedUser", Auth, async (req, res) => {
  try {
    const { followedUser } = req.params;
    const follower = req.user.id;
    const Unfollow = await Pool.query(
      `
     DELETE  FROM follows WHERE followed_id=$1 AND  follower_id=$2 RETURNING * 
    `,
      [followedUser, follower]
    );

    const Rows = Unfollow.rows.length;
    if (Rows === 0) {
      return res.status(404).json({
        success: false,
        message: `there is no account  with ${followedUser}  `,
      });
    }
    return res.status(200).json({
      success: true,
      message: "unfollow user succefully",
      data: Unfollow.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal server error");
  }
});

router.get("/posts/:id/like", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "invalid post id",
      });
    }

    const GetAllLikes = await Pool.query(
      `
      SELECT 
      likes.user_id,likes.post_id,posts.user_id,posts.content
      FROM likes
      JOIN posts ON likes.post_id=posts.id
      WHERE likes.post_id=$1
     
        `,
      [id]
    );

    const rows = GetAllLikes.rows.length;
    if (rows === 0) {
      return res.status(200).json({
        success: true,
        message: `there is no likes under this post`,
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      data: GetAllLikes.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal Server error");
  }
});

router.post("/posts/:postId/like", Auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const UserId = req.user.id;
    if (isNaN(postId)) {
      return res.status(400).json("Please insert valid id");
    }

    const AddLike = await Pool.query(
      `
     INSERT INTO likes (user_id,post_id) VALUES ($1,$2) RETURNING *
    `,
      [UserId, postId]
    );

    return res.status(200).json({
      success: true,
      message: "like added successfully",
      data: AddLike.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal Server error");
  }
});

router.delete("/post/:postId/like", Auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const deleteLike = await Pool.query(
      `
     DELETE  FROM likes WHERE user_id=$1 AND post_id=$2
   RETURNING * `,
      [userId, postId]
    );

    const Rows = deleteLike.rows.length;
    if (Rows === 0) {
      return res.status(404).json({
        success: false,
        message: `there is no like  with in this post `,
      });
    }
    return res.status(200).json({
      success: true,
      message: "like deleted succefully",
      data: deleteLike.rows[0],
    });
  } catch (error) {
    console.error("Fetch  single Orders Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
// @import "tailwindcss";

// feed need some fix
router.get("/feed", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const selectJoinTable = await Pool.query(
      `
   SELECT posts.id, posts.user_id, posts.content, posts.created_at, posts.updated_at, users.username, users.images
FROM posts
JOIN follows ON posts.user_id = follows.followed_id
JOIN users ON users.id = posts.user_id
WHERE follows.follower_id = $1
        `,
      [userId]
    );

    if (selectJoinTable.rows.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "no post from ur followers" });
    }
    return res.status(200).json({
      success: true,
      message: "done showing your feed",
      data: selectJoinTable.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal Server error");
  }
});

router.get("/profile", Auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Pool.query(
      `SELECT
         users.id,
         users.username,
         users.profile,
         users.description,
         COUNT(DISTINCT posts.id)          AS posts,
         COUNT(DISTINCT f1.follower_id)    AS followers,
         COUNT(DISTINCT f2.followed_id)    AS following,
         MAX(s.handle) FILTER (WHERE s.platform = 'instagram') AS instagram,
         MAX(s.handle) FILTER (WHERE s.platform = 'facebook')  AS facebook,
         MAX(s.handle) FILTER (WHERE s.platform = 'telegram')  AS telegram
       FROM users
       LEFT JOIN posts        ON posts.user_id = users.id
       LEFT JOIN follows f1   ON f1.followed_id = users.id
       LEFT JOIN follows f2   ON f2.follower_id = users.id
       LEFT JOIN social_links s ON s.user_id = users.id
       WHERE users.id = $1
       GROUP BY users.id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "user not found" });
    }

    const latest = await Pool.query(
      `SELECT posts.id, posts.content, posts.images, posts.created_at,
              COUNT(likes.post_id) AS likes
       FROM posts
       LEFT JOIN likes ON likes.post_id = posts.id
       WHERE posts.user_id = $1
       GROUP BY posts.id
       ORDER BY posts.created_at DESC
       LIMIT 1`,
      [userId]
    );

    const row = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        ...row,
        posts: Number(row.posts),
        followers: Number(row.followers),
        following: Number(row.following),
        latestPost: latest.rows[0] || null,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.put("/profile", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    let { username, description } = req.body;

    if (username !== undefined) {
      username = username.trim();
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({
          success: false,
          message: "username must be 3 to 30 characters",
        });
      }

      // username must not belong to someone else
      const taken = await Pool.query(
        `SELECT id FROM users WHERE username=$1 AND id<>$2`,
        [username, userId]
      );
      if (taken.rows.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "username already taken" });
      }
    }

    if (description !== undefined && description.length > 200) {
      return res.status(400).json({
        success: false,
        message: "description is limited to 200 characters",
      });
    }

    const updated = await Pool.query(
      `UPDATE users
       SET username    = COALESCE($1, username),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING id, username, description, profile`,
      [username ?? null, description ?? null, userId]
    );

    return res.status(200).json({ success: true, data: updated.rows[0] });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

const PLATFORMS = ["instagram", "facebook", "telegram"];

router.post("/profile/social", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { platform, handle } = req.body;

    if (!PLATFORMS.includes(platform)) {
      return res.status(400).json({
        success: false,
        message: `platform must be one of: ${PLATFORMS.join(", ")}`,
      });
    }
    if (!handle || !handle.trim() || handle.length > 100) {
      return res
        .status(400)
        .json({ success: false, message: "invalid handle" });
    }

    const saved = await Pool.query(
      `INSERT INTO social_links (user_id, platform, handle)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, platform)
       DO UPDATE SET handle = EXCLUDED.handle
       RETURNING platform, handle`,
      [userId, platform, handle.trim()]
    );

    return res.status(200).json({ success: true, data: saved.rows[0] });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.delete("/profile/social/:platform", Auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { platform } = req.params;

    const removed = await Pool.query(
      `DELETE FROM social_links WHERE user_id=$1 AND platform=$2 RETURNING platform`,
      [userId, platform]
    );

    if (removed.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: `no ${platform} link found` });
    }

    return res.status(200).json({ success: true, message: "link removed" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});
export default router;
