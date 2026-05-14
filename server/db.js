// server/db.js
const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root', // Laragon default; do NOT do this in production
    database: 'employee_records',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = pool