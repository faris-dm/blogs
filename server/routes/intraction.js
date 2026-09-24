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
      ` SELECT *  FROM  comments  WHERE post_id=$1 `,
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
      return res.status(400).json({ success: false, message: " post does not exits" });
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

router.put("/posts/:id/comments/edit", Auth, async (req, res) => {
  try {
    const { id } = req.params;
    const UserId = req.user.id;
    const { content } = req.body;
    if (content === "") {
      return res
        .status(400)
        .json({ success: false, message: "invalid inputs" });
    }
    const updateComment = await Pool.query(
      `UPDATE comments  SET content=$1  WHERE post_id=$2 AND user_id=$3 RETURNING *`,
      [content, id, UserId]
    );

    if (updateComment.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "comment  does not exist" });
    }

    return res.status(200).json({
      success: true,
      data: updateComment.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("internal server error");
  }
});
router.delete("/posts/:id/comments/:ids", Auth, async (req, res) => {
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
    if (followed_user === follower) {
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

router.get("/post/:id/like", async (req, res) => {
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
       SELECT * FROM likes WHERE post_id=$1 
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

router.post("/post/:postId/like", Auth, async (req, res) => {
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
WHERE follows.follower_id = $
        `,
      [userId]
    );

    if(selectJoinTable.rows.length===0) {
        return res.status(200).json({success:true,message:"no post from ur followers"})
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

export default router;
