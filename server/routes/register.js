import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cookies from "cookie-parser";
const app = express();
import Pool from "../config/db.js";
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

const secret = process.env.AccessSecret;
const refreshSecret = process.env.refreshSecret;
const generateAccess = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "15m" });
};
const generateRefresh = (Refreshpayload) => {
  return jwt.sign(payload, refreshSecret, { expiresIn: "7d" });
};

app.get("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json("invalid input,pleases try again");
    }

    const EmailCheck = await Pool.query(`SELECT * FROM users WHERE email=$1`, [
      email
    ]);
    if (EmailCheck.rows.length > 0) {
      return res
        .status(409)
        .json("invlaid  inputs");
        
    }
    // EMAIL AREADY EXIST  409 CONFILICT WE 
    const hashPassword = await bcrypt.hash(password, 10);
    const saveNewUser = await Pool.query(
      `INSERT INTO users  WHERE (username,email,password_hash) VALUES ($1,$2,$3) RETURNING user_id,username,email
    `,
      [username, email, hashPassword]
    );
    const Result = saveNewUser.rows[0];

    const payload = {
      id: Result.id,
      email: Result.email,
    
    };
    const RefreshPayload = {
      id: Result.id,
    };

    let accesTokens = generateAccess(payload);
    let refreshTokens = generateRefresh(RefreshPayload);

    const databaseTRefesh= new Pool.query(`INSERT  INTO refresh_tokens (user_id,token) VALUES ($1,$2) RETURNING id,user_id,token `,[Result.id,refreshTokens])

    

    res.cookie("tokens", accesTokens, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokens, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: "7 *24*60 *60 *1000",
    });

    return res.status(200).json("registered succefully");
  } catch (error) {
    console.log(error);
    return res.status(500).json("server failed");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json("valid inputs are needed");
    }

    const emailCheck = await Pool.query(
      ` SELECT id,username,email,password,role FROM user  WHERE email =$1`,
      [email]
    );
    if (emailCheck.rows.length === 0) {
      return res.status(404).json("email does not exits ");
    }
    const resultLogin = emailCheck.rows[0];

    const compareMatch = await bcrypt.compare(password, resultLogin.password);
    if (!compareMatch) {
      return res.status(401).json("invalid inputs");
    }

    const payload = {
      id: resultLogin.user_id,
      email: resultLogin.email,
      role: resultLogin.role,
    };

    const RefreshPayload = {
      id: resultLogin.user_id,
    };
    const accessTokns = generateAccess(payload);
    const refreshToken = generateRefresh(RefreshPayload);

    await Pool.query(
      "INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)",
      [resultLogin.id, refreshToken]
    );

    res.cookie("token", accessTokns, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: REFRESH_TOKEN_EXPIRY_MS,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: resultLogin.id,
        username: resultLogin.username,
        email: resultLogin.email,
        role: resultLogin.role,
      },
    });

    //    it need  the jwt  token we need  to study that
  } catch (error) {
    console.log(error);
    return res.status(500).json("server failed");
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const incomingToken = req.cookies?.refreshToken;

    if (!incomingToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    // Step 1: check the signature itself is valid and not expired
    jwt.verify(
      incomingToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token",
          });
        }

        // Step 2: check it hasn't been revoked (e.g. via logout) —
        // this is the check a plain jwt.verify alone can never do
        const dbCheck = await Pool.query(
          "SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2",
          [incomingToken, decoded.id]
        );

        if (dbCheck.rows.length === 0) {
          return res
            .status(403)
            .json({ success: false, message: "Refresh token not recognized" });
        }

        // Pull fresh user info in case role/email changed since the token was issued
        const userQuery = await Pool.query(
          "SELECT id, email, role FROM users WHERE id = $1",
          [decoded.id]
        );
        const user = userQuery.rows[0];

        // Issue ONLY a new access token — the refresh token stays as-is
        const newAccessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        res.cookie("token", newAccessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        });

        return res
          .status(200)
          .json({ success: true, message: "Access token refreshed" });
      }
    );
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default app;
