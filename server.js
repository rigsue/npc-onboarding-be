import express from 'express';
import pool from "./db.js";

const app = express();

const PORT = process.env.PORT || 3001

async function startServer() {
    try {
        await pool.query("SELECT NOW()");

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