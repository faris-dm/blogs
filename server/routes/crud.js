import express from "express";
import "dotenv/config";
import Pool from "../config/db.js";
const router = express.Router();
import Auth from "../middle/auth.js";

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// get  all the posts
router.get("/posts", async (req, res) => {
  try {
    const GetPost = await Pool.query(
      ` SELECT *  FROM  posts  ORDER BY id DESC`
    );

    if (GetPost.rows.length == 0) {
      return res.status(404).json({
        success: false,
        messsage: "there is no post avaliable for now",
      });
    }
    return res.status(200).json({
      success: true,
      data: GetPost.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});

router.post("/posted", Auth, async (req, res) => {
  try {
    const { content } = req.body;
    const id = req.user.id;
    if (!id || isNaN(id) || !content || content === "") {
      return res.status(400).json({
        success: false,
        messsage: "invalid Inputs",
      });
    }
    const AddPost = await Pool.query(
      `INSERT INTO posts (user_id,content) VALUES ($1,$2) RETURNING *`,
      [id, content]
    );

    const resulNewPost = AddPost.rows.length;
    if (resulNewPost === 0) {
      return res.status(400).json({
        success: "false",
        messsage: "failed to add new posts",
      });
    }
    return res.status(201).json({
      message: "Post Created succefully",
      data: AddPost.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});

export default router;
