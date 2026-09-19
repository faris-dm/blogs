import express from "express"
import pg  from "pg"
import register  from "./routes/register.js"
const app =express()
app.use(express.json())
const port =2019







app.listen(port,()=> {
    console.log(` the server at http://localhost:${port}`)
})