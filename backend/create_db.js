const mysql = require('mysql2/promise');
require('dotenv').config();

const initDB = async () => {
    try {
        // Connect to server without database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log(`Database ${process.env.DB_NAME} created or already exists.`);
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error.message); // Print message only for clarity
        process.exit(1);
    }
};

initDB();
