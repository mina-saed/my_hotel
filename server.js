const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3307;

// Middleware to parse JSON
app.use(express.json());
const corsOptions = {
    origin: 'http://127.0.0.1:5501', // Allow only this origin
    methods: ['GET', 'POST'],       // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '01208732683', // Set your password in a .env file
    database: process.env.DB_NAME || 'hotel',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');

    // Reading and executing SQL from hotel.sql
    const sqlFilePath = path.join(__dirname, 'hotel.sql');
    if (fs.existsSync(sqlFilePath)) {
        const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');
        db.query(sqlQuery, (err, result) => {
            if (err) {
                console.error('Error executing SQL from hotel.sql:', err);
            } else {
                console.log('SQL executed successfully.');
            }
        });
    } else {
        console.error(`File not found: ${sqlFilePath}`);
    }
});

// API to add new guest
//addingData  
app.post('/api/add-guest', (req, res) => {
    const { firstName, lastName, email, phoneNumber } = req.body;

    // Validate input data
    if (!firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).json({ error: 'Missing required fields.' });
    }

    const query = `
        INSERT INTO guests (first_name, last_name, email, phone_number) 
        VALUES (?, ?, ?, ?);
    `;

    // Execute query with user-provided values
    db.query(query, [firstName, lastName, email, phoneNumber], (err, results) => {
        if (err) {
            console.error('Error adding guest:', err);
            return res.status(500).json({ error: 'Failed to add guest.' });
        }
        res.json({ message: 'Guest added successfully!', guestId: results.insertId });
    });
});

//------------------------------------------------------------
// API to fetch available rooms
app.get('/api/get-rooms', (req, res) => {
    const query = "SELECT * FROM rooms  ;";

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching rooms:', err);
            return res.status(500).json({ error: 'Failed to fetch rooms.' });
        }
        res.json(results);
    });
   
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
