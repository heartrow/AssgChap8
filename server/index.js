const express   = require('express')
const cors      = require('cors')
const pool      = require('./db')

const app = express()
app.use(cors())
app.use(express.json())

// --- Health check ---
app.get('/', (req, res) => res.json({ status: 'ok' }))

// --- READ list (with optional search & sort) ---
app.get('/employees', async (req, res) => {
    try {
        const { q, sortBy, order } = req.query
        let sql = 'SELECT * FROM employees'
        const params = []

        if (q) {
            sql += ` WHERE name LIKE ?
                        OR empId LIKE ?
                        OR email LIKE ?
                        OR department LIKE ?`
            const like = `%${q}%`
            params.push(like, like, like, like)
        }

        const allowedSort = ['name', 'empId', 'department', 'position', 'hireDate']
        if (sortBy && allowedSort.includes(sortBy)) {
            const direction = order === 'desc' ? 'DESC' : 'ASC'
            sql += ` ORDER BY ${sortBy} ${direction}`
        }

        const [rows] = await pool.query(sql, params)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

// --- READ single ---
app.get('/employees/:empId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM employees WHERE empId = ?', [req.params.empId])
        if (!rows.length) return res.status(404).json({ error: 'Not found' })
            res.json(rows[0])
    } catch (err) {
        res.status(500).json({ error: 'Database error' })
    }
})

// --- CREATE ---
app.post('/employees', async (req, res) => {
    try {
        const { empId, name, email, department, position, hireDate, salary, active } = req.body
        
        if (!empId) {
            return res.status(400).json({ error: 'An explicit Employee ID is required' })
        }
        
        await pool.query (
            `INSERT INTO employees
                (empId, name, email, department, position, hireDate, salary, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [empId, name, email, department, position, hireDate, salary, active ? 1 : 0]
        )

        res.status(201).json(req.body)

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Employee ID already exists' })
        }
        console.error(err)
        res.status(500).json({ error: 'Database error' })
    }
})

// --- UPDATE ---
app.put('/employees/:empId', async (req, res) => {
    try {
        const { empId, name, email, department, position, hireDate, salary, active } = req.body
        const [r] = await pool.query(
            `UPDATE employees SET
                empId=?, name=?, email=?, department=?, 
                position=?, hireDate=?, salary=?, active=?
            WHERE empId=?`,
            [empId, name, email, department, position, hireDate, salary, 
             active ? 1 : 0, req.params.empId]
        )
        if (!r.affectedRows) return res.status(404).json({ error: 'Not found' })

        res.json(req.body)
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Cannot update: Target Employee ID already exists' })
        }
        res.status(500).json({ error: 'Database error' })
    }
})

// --- DELETE ---
app.delete('/employees/:empId', async (req, res) => {
    try {
        const [r] = await pool.query(
            'DELETE FROM employees WHERE empId = ?', [req.params.empId])
        if (!r.affectedRows) return res.status(404).json({ error: 'Not found' })
        res.json({ deleted: true })
    } catch (err) {
        res.status(500).json({ error: 'Database error' })
    }
})

const PORT = 3000
app.listen(PORT, () => 
    console.log(`API runnning at http://localhost:${PORT}`))