const db = require('./db');
const mysql = require('mysql2');
const util = require('util');
const { prompt } = require('inquirer');
require("console.table");

// Connnect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employees_db'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Made connection');
});
  
connection.query = util.promisify(connection.query);

init();

function init() {
    console.log ("Hello, Welcome to Employee Tracker!");   
    loadMainPrompts();
}

// Load Questions
async function loadMainPrompts() {
    const { choice } = await prompt([
       {
           type: 'list',
           name: 'choice',
           message: 'What would you like to do?',
           choices: [
               {
                   name: 'View All Employees',
                   value: 'GET_EMPLOYEES'
               }
           ]
       } 
    ])

    // Switch cases to call functions
    switch (choice) {
        case 'GET_EMPLOYEES':
            return getAllEmployees();
    }
};

// View all Employees
async function getAllEmployees() {
    connection.query(
        'SELECT employees.id, first_name AS "First Name", last_name AS "Last Name", roles.title AS "title", roles.salary AS "salary" FROM employees LEFT JOIN roles ON roles.id = role_id',
        function(err, results, fields) {
            console.table(results); 
            // console.log(fields);
        }
    )
};



