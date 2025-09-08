import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { pool } from "./db.js";
dotenv.config();

if (process.env.AUTH_MODE !== "local") {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.OAUTH_CALLBACK_URL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const google_sub = profile.id;
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName || profile.name?.givenName || "Google User";

          // Find by google_sub or email
          const [rows] = await pool.execute(
            "SELECT * FROM users WHERE google_sub = ? OR email = ? LIMIT 1",
            [google_sub, email]
          );

          if (rows.length) {
            // Link google_sub if missing
            if (!rows[0].google_sub) {
              await pool.execute("UPDATE users SET google_sub=? WHERE id=?", [google_sub, rows[0].id]);
            }
            return done(null, rows[0]);
          }

          // Default new users to 'student' role
          const [result] = await pool.execute(
            "INSERT INTO users (google_sub, email, name, role) VALUES (?,?,?,?)",
            [google_sub, email, name, "student"]
          );
          const [userRows] = await pool.execute("SELECT * FROM users WHERE id=?", [result.insertId]);
          return done(null, userRows[0]);
        } catch (e) {
          done(e);
        }
      }
    )
  );
}

export default passport;
