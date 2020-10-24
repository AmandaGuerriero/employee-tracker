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
                    name: 'View All Departments',
                    value: 'GET_DEPARTMENTS'
                },
                {
                    name: 'View All Roles',
                    value: 'GET_ROLES'
                },
                {
                    name: 'View All Employees',
                    value: 'GET_EMPLOYEES'
                },
                {
                    name: 'Add a Department',
                    value: 'ADD_DEPARTMENT'
                },
           ]
       },
       
    ])

    // Switch cases to call functions
    switch (choice) {
        case 'GET_DEPARTMENTS':
            return getAllDepartments();
        case 'GET_ROLES':
            return getAllRoles();
        case 'GET_EMPLOYEES':
            return getAllEmployees();
        case 'ADD_DEPARTMENT':
            return addDepartment();
    }
};

// View all Departments
async function getAllDepartments() {
    connection.query(
        'SELECT departments.id AS "Department ID", name AS "Department Name" FROM departments',
        function(err, results, fields) {
            console.table(results); 
            loadMainPrompts();
        }
    )
};

// View all Roles
async function getAllRoles() {
    connection.query(
        'SELECT roles.id AS "Role ID", title AS "Job Title", salary AS "Salary", departments.name AS "Department Name" FROM roles LEFT JOIN departments ON roles.department_id = departments.id',
        function(err, results, fields) {
            console.table(results); 
            loadMainPrompts();
        }
    )
};

// View all Employees
async function getAllEmployees() {
    connection.query(
        'SELECT employees.id AS "Employeed ID", first_name AS "First Name", last_name AS "Last Name", roles.title AS "Title", roles.salary AS "Salary", departments.name AS "Department" FROM employees LEFT JOIN roles ON roles.id = role_id LEFT JOIN departments ON departments.id = department_id',
        function(err, results, fields) {
            console.table(results); 
            loadMainPrompts();
        }
    )
};

// Add Department
async function addDepartment() {
    prompt({
        type: "input",
        message: "What is the name of the department?",
        name: "departmentName"
    })
    .then(function(answer){
    connection.query(
        'INSERT INTO departments (name) VALUES (?)', 
        [answer.departmentName],
        function(err, results) {
            console.table(results); 
            loadMainPrompts();
        })
    })
};




