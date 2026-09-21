 import express from "express"
 import "dotenv/config"
 import jwt  from "jsonwebtoken"






function middleWare(req,res,next) {
    const { token}= req.cookies
     if(!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token does not exist" });
     }

     jwt.verify(token,process.env.AccessSecret, (err,decoded)=> {
        if(err) {
return res
  .status(403)
  .json({ success: false, message: "Invalid or expired token" });
        }
        req.user=decoded
            next()
     })

     
 
    
}


export default middleWare