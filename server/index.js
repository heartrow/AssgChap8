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
    const { empId, name, email, department, position, hireDate, salary } = req.body;

    // Simple Server-side Validation
    if (!empId || !name || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const sql = `INSERT INTO employees (empId, name, email, department, position, hireDate, salary, active) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`;
        await db.execute(sql, [empId, name, email, department, position, hireDate, salary]);
        
        res.status(201).json({ message: "Employee created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/employees/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, department, position, salary, active } = req.body;

    try {
        const sql = `UPDATE employees SET name=?, email=?, department=?, position=?, salary=?, active=? 
                     WHERE empId=?`;
        await db.execute(sql, [name, email, department, position, salary, active, id]);
        res.json({ message: "Record updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/employees/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute("DELETE FROM employees WHERE empId = ?", [id]);
        res.json({ message: "Employee deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const handleAdd = async (formData) => {
    const res = await fetch('/employees', { method: 'POST', body: JSON.stringify(formData) });
    if (res.ok) {
        form.reset();      // Clear form on success
        refreshList();     // Re-fetch the list to show the new record
    }
};

const handleDelete = async (empId) => {
        if (confirm("Are you sure you want to delete this employee?")) {
            await fetch(`/employees/${empId}`, { method: 'DELETE' });
            refreshList();
        }
    };