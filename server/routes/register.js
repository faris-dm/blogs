import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cookieParser from "cookie-parser";
const router = express.Router();
import Pool from "../config/db.js";
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(express.json());

const secret = process.env.AccessSecret;
const refreshSecret = process.env.refreshSecret;
const generateAccess = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "15m" });
};
const generateRefresh = (Refreshpayload) => {
  return jwt.sign(Refreshpayload, refreshSecret, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json("invalid input,pleases try again");
    }

    const EmailCheck = await Pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (EmailCheck.rows.length > 0) {
      return res.status(409).json("invlaid  inputs");
    }
    // EMAIL AREADY EXIST  409 CONFILICT WE
    const hashPassword = await bcrypt.hash(password, 10);
    const saveNewUser = await Pool.query(
      `INSERT INTO users  (username,email,password_hash) VALUES ($1,$2,$3) RETURNING id,username,email
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

    await Pool.query(
      `INSERT  INTO refresh_tokens (user_id,token) VALUES ($1,$2) RETURNING id,user_id,token `,
      [Result.id, refreshTokens]
    );

    res.cookie("token", accesTokens, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshTokens, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "registed succefully",
      user: Result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("server failed");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json("incorrect inputs ");
    }

    const emailCheck = await Pool.query(
      ` SELECT id,username,email,password_hash FROM users  WHERE email =$1`,
      [email]
    );
    if (emailCheck.rows.length === 0) {
      return res.status(401).json("incorrect inputs ");
    }
    const resultLogin = emailCheck.rows[0];

    const compareMatch = await bcrypt.compare(
      password,
      resultLogin.password_hash
    );
    if (!compareMatch) {
      return res.status(401).json("incorrect inputs");
    }

    const payload = {
      id: resultLogin.id,
      email: resultLogin.email,
    };

    const RefreshPayload = {
      id: resultLogin.id,
    };
    const accessTokns = generateAccess(payload);
    const refreshToken = generateRefresh(RefreshPayload);
    console.log(accessTokns, "accesstokens");
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Loin succefully",
      user: {
        id: resultLogin.id,
        username: resultLogin.username,
        email: resultLogin.email,
      },
    });

    //    it need  the jwt  token we need  to study that
  } catch (error) {
    console.log(error);
    return res.status(500).json("server failed");
  }
});

// router.post("/logout", async (req, res) => {
//   try {
//     const { refreshToken, token } = req.cookies;

//     if (!refreshToken) {
//       return res.status(400).json({ message: "Refresh token is required." });
//     }

//     const DeleteFresh = await Pool.query(
//       ` SELECT * FROM refresh_tokens  WHERE token=$1`,
//       [refreshToken]
//     );
//     if (DeleteFresh.rows.length === 0) {
//       return res.status(404).json("refresh token does not in the database");
//     }
//     const realDelete = await Pool.query(
//       ` DELETE FROM refresh_tokens WHERE token =$1  RETURNING * `,
//       [refreshToken]
//     );

//     res.clearCookie("token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     return res.status(200).json({ message: "Logged out successfully." });
//   } catch (error) {
//     console.error("Logout error:", error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// });

// router.post("/refresh-token", async (req, res) => {
//   try {
//     const refreshToken = req.cookies?.refreshToken;

//     if (!refreshToken) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No refresh token provided" });
//     }

//     // Step 1: check the signature itself is valid and not expired
//     jwt.verify(
//       refreshToken,
//       process.env.refreshSecret,
//       async (err, decoded) => {
//         if (err) {
//           return res.status(403).json({
//             success: false,
//             message: "Invalid or expired refresh token",
//           });
//         }

//         const dbCheck = await Pool.query(
//           "SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2",
//           [refreshToken, decoded.id]
//         );

//         if (dbCheck.rows.length === 0) {
//           return res
//             .status(403)
//             .json({ success: false, message: "Refresh token not recognized" });
//         }

//         // Pull fresh user info in case role/email changed since the token was issued
//         const userQuery = await Pool.query(
//           "SELECT id, email FROM users WHERE id = $1",
//           [decoded.id]
//         );
//         const user = userQuery.rows[0];

//         // Issue ONLY a new access token — the refresh token stays as-is
//         const newAccessToken = generateAccess({
//           id: user.id,
//           email: user.email,
//         });

//         res.cookie("token", newAccessToken, {
//           httpOnly: true,
//           secure: false,
//           sameSite: "lax",
//           maxAge: 15 * 60 * 1000,
//         });

//         return res
//           .status(200)
//           .json({ success: true, message: "Access token refreshed" });
//       }
//     );
//   } catch (error) {
//     console.error("Refresh Token Error:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Internal server error" });
//   }
// });

router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }

    // Verify the token belongs to a real, still-valid session before deleting it
    const tokenCheck = await Pool.query(
      `SELECT * FROM refresh_tokens WHERE token=$1`,
      [refreshToken]
    );
    if (tokenCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Refresh token not found" });
    }

    await Pool.query(`DELETE FROM refresh_tokens WHERE token=$1`, [
      refreshToken,
    ]);

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, refreshSecret, async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      const dbCheck = await Pool.query(
        `SELECT * FROM refresh_tokens WHERE token=$1 AND user_id=$2`,
        [refreshToken, decoded.id]
      );
      if (dbCheck.rows.length === 0) {
        return res
          .status(403)
          .json({ success: false, message: "Refresh token not recognized" });
      }

      const userQuery = await Pool.query(
        `SELECT id, email FROM users WHERE id=$1`,
        [decoded.id]
      );
      const user = userQuery.rows[0];

      const newAccessToken = generateAccess({ id: user.id, email: user.email });

      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
      });

      return res
        .status(200)
        .json({ success: true, message: "Access token refreshed" });
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
