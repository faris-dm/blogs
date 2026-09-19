 import express from "express"
 import "dotenv/config"
 import jwt  from "jsonwebtoken"





function middleWare(req,res,next) {
    const { token}= req.cookies
     if(!token) {
        return res.status(401).json(" token does not exits")
     }

     jwt.verify(token,process.env.AccessSecret, (err,decoded)=> {
        if(err) {
            return res.status(403).json("token does not much ")
        }
        req.user=decoded
            next()
     })

     
 
    
}