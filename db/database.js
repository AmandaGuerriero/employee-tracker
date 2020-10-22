const mysql = require('mysql2');

// Connnect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'NBfury009!Rose',
    database: 'employee_db'
});

module.exports = connection;