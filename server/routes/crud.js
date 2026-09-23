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

  
    return res.status(200).json({
      success: true,
      data: GetPost.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});

router.get("/posts/:id", async(req,res)=> {
  try {
    const {id}=req.params
    
    if(isNaN(id)) {
      return res.status(400).json({success:false,message:"invalid input"})
    }

    const SelectOnePost=await Pool.query(`SELECT *  FROM posts WHERE id=$1 `,[id])
    const rows=SelectOnePost.rows.length
    if(rows===0) {
      return res.status(404).json({success:false,message:`there is no post with ${id}`})
    }
    return res.status(200).json({
      success:true,
      data:SelectOnePost.rows[0]
    })
    
    
  } catch (error) {
      console.error(error);
      return res.status(500).json("Intrnal Server error");
  }

})

router.post("/posted", Auth, async (req, res) => {
  try {
    const { content } = req.body;
    const id = req.user.id;
    if (!content ) {
      return res.status(400).json({
        success: false,
        message: "invalid Inputs",
      });
    }


    if(content.length > 280) {
      return res.status(400).json({success:false,message:"maximum input limite"})
    }
    const AddPost = await Pool.query(
      `INSERT INTO posts (user_id,content) VALUES ($1,$2) RETURNING *`,
      [id, content]
    );

   
 
    return res.status(201).json({
      message: "Post Created succefully",
      data: AddPost.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server error");
  }
});




router.put("/posts/:id/edit", Auth, async (req,res)=> {
  try {
const {id}=req.params
const UserId=req.user.id
    const {content}=req.body
    if( content=== "") {
      return res.status(400).json({success:false,message:"invalid inputs"})
    }

   


      const EditPost=await Pool.query(` UPDATE posts  SET content=$1  WHERE id=$2 AND user_id=$3 RETURNING *`,[content,id,UserId])

const existPost = EditPost



 
 if (existPost.rows.length === 0) {
   return res
     .status(404)
     .json({ success: false, message: "post does not exist" });
 }


          return res.status(200).json({
            success: true,
            data: EditPost.rows[0],
          });
    
  } catch (error) {
    console.log(error)
    return res.status(500).json("internal server error")
    
  }



})

router.delete("/posts/:id", Auth,async (req,res)=> {
 try {
  const UserId=req.user.id
  const {id}=req.params

  const DeletePost=await Pool.query(` DELETE  FROM posts WHERE id=$1 AND user_id=$2  RETURNING *`,[id,UserId])
 const Rows = DeletePost.rows.length;
    if (Rows === 0) {
      return res.status(404).json({
        success: false,
        message: `there is no Post  with ${id}  `,
      });
    }


       return res.status(200).json({
      success: true,
      message:"item deleted succefully",
      data: DeletePost.rows[0],
    });
 } catch (error) {
    console.error(error);
    return res.status(500).json("Intrnal server error");
  
 }

})

export default router;
