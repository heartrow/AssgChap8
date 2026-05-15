const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees'
})

app.get('/employees', async (req, res) => {
    try {
        const { q, sortBy, order } = req.query;
        let query = "SELECT * FROM employees WHERE 1=1";
        let params = [];

        if (q) {
            query += " AND (name LIKE ? OR empID LIKE ? OR email LIKE ?)";
            const searchVal = `%${q}%`;
            params.push(searchVal, searchVal, searchVal);
        }

        const allowedColumns = ['name', 'hireDate', 'salary'];
        const sortColumn = allowedColumns.includes(sortBy) ? sortBy : 'empId';
        const sortOrder = order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        query += ` ORDER BY ${sortColumn} ${sortOrder}`;
        
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/employees', async (req, res) => {
    const {}
})