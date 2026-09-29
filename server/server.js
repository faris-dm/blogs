import express from "express";
import pg from "pg";
import register from "./routes/register.js";
import Crud from "./routes/crud.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import Intractions from "./routes/intraction.js";
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
const port = 2019;

app.use("/api", register);
app.use("/api", Crud);
app.use("/api", Intractions);
app.get("/", (req, res) => {
  res.status(200).json("the server is working");
});

app.listen(port, () => {
  console.log(` the server at http://:localhost:${port}`);
});
