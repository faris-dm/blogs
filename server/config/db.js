import pg from "pg";
import "dotenv/config";
const Pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export default Pool;
