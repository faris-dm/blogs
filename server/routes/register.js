import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import 'dotenv/config'
const app= express()
import Pool from "../config/db.js"
app.use(express.urlencoded({extended:true}))

const secret=process.env.AccessSecret
const refreshSecret=process.env.refreshSecret
const generateAccess=(payload) {
    return jwt.sign(payload,secret,{ expiresIn: "15m" })
}
const generateRefresh=(Refreshpayload)=> {
    return jwt.sign(payload,refreshSecret,{ expiresIn: "7d" })
}








app.get("/register", async (req,res)=> {
    try {
        const {username,email,password}=req.body
        if(!username || !email ||!password) {
            return  res.status(404).json("invalid input ,pleases try again")
        }
const EmailCheck= await Pool.query(`SELECT * FROM user WHERE email=$1`,[email.trim()])
if(EmailCheck.rows.length > 0) {
    return res.status(404).json("email aready exist,try other  email or login")

}
 const hashPassword=await bcrypt.haspassword(password,10)
 const saveNewUser=await Pool.query(`INSERT INTO user (username,email,hashPassword)
     VALUES ($1,$2,$3) RETURNING user_id,username,email
    `,[username,email,hasgPassword])
  const Result= saveNewUser.rows[0]


      
        const payload ={
          id:Result.user_id,
          email:Result.email,
           role:Result.role,


        }
        const Refreshpayload={
            email:Result.email
        }

        let accesTokens=generateAccess(payload)
        let refreshTokens=generateRefresh(refreshSecret)




 return res.status(200).json("registered succefully")
    } catch (error) {
         console.log(error)
        return res.status(500).json("server failed")
    }
})


  app.post("/login", async (req,res)=> {
    try {
        const {email,password}=req.body

        if(!email || !password) {
            return res.status(404).json("valid inputs are needed")
        }


        const emailCheck= await  Pool.query(` SELECT id,username,email FROM user  WHERE email =$1`,[email])
        if(emailCheck.rows.length < 0) {
            return res.status(404).json("email does not exits ")
        }
        const resultLogin=emailCheck.rows[0]

 const  payload={
    id:resultLogin.user_id,
    email:resultLogin.email,
    role:resultLogin.role
 }


//    it need  the jwt  token we need  to study that
        
    } catch (error) {
        console.log(error)
        return res.status(500).json("server failed")

        
    }
  })















export default app