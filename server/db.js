// server/db.js
require('dotenv').config()
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'ski_db', // Laragon default; do NOT do this in production
    database: 'employee_records',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool