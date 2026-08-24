import mysql2 from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = await mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});