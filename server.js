import app from "./app.js";
import pool from "./src/config/db.js";

// const app = express();

const PORT = process.env.PORT || 3001

// let testConnect;
async function startServer() {
    try {
        await pool.query("SELECT NOW()",
            console.log("Connected to my PostgreSql")
        );

        app.listen(PORT, () => {
            console.log(`API is now online on port ${PORT}`);
        });
    } catch (err) {
            console.error("Database connection failed");
            console.error(err);
            process.exit(1);
        }
    }
    
startServer();
/* app.listen(PORT, () =>
console.log(`API is now online at port ${PORT}`)); */