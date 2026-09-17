import express from "express"
import pg  from "pg"
const app =express()
app.use(express.json())
const port =2019





app.listen(port,()=> {
    console.log(` the server is running at http://localhost:${port}`)
})