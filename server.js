// server.js
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'student_db',
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Create Student
app.post('/students', (req, res) => {
    const { first_name, last_name, email } = req.body;
    const sql = 'INSERT INTO Students (first_name, last_name, email) VALUES (?, ?, ?)';
    db.query(sql, [first_name, last_name, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId });
    });
});

// Get All Students
app.get('/students', (req, res) => {
    const sql = 'SELECT * FROM Students';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Get Student by ID
app.get('/students/:id', (req, res) => {
    const sql = 'SELECT * FROM Students WHERE student_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.length === 0) return res.status(404).send('Student not found');
        res.json(result[0]);
    });
});

// Update Student
app.put('/students/:id', (req, res) => {
    const { first_name, last_name, email } = req.body;
    const sql = 'UPDATE Students SET first_name = ?, last_name = ?, email = ? WHERE student_id = ?';
    db.query(sql, [first_name, last_name, email, req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Student updated successfully.');
    });
});

// Delete Student
app.delete('/students/:id', (req, res) => {
    const sql = 'DELETE FROM Students WHERE student_id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send('Student deleted successfully.');
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
