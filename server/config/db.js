import pg from "pg";
import "dotenv/config";
const Pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
// fixed
export default Pool;
