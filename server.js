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
                {
                    name: 'Add a Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Add an Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: "I'm done",
                    value: 'DONE'
                }
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
        case 'ADD_ROLE':
            return addRole();
        case 'ADD_EMPLOYEE':
            return addEmployee();
        case 'DONE':
            return exitConnection();
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

// Add a Role
async function addRole() {
    prompt([
        {
            type: "input",
            message: "What is this new role's title?",
            name: "roleTitle",
            validate: answer => {
                if (answer !== '') {
                    return true;
                } 
                return ('You must enter a title for this role!');
            }
        },
        {
            type: "input",
            message: "What is this new role's salary?",
            name: "roleSalary",
            validate: answer => {
                const pass = answer.match(
                    /[1-9]/                
                );
                if (pass) {
                    return true;
                }
                return ('You need to input a number')
            }
        },
        {
            type: "input",
            message: "What department id for this role?",
            name: "roleDepartment",
            validate: answer => {
                const pass = answer.match(
                    /[1-9]/                
                );
                if (pass) {
                    return true;
                }
                return ('You need to input the number of the department')
            }
        }
    ])
    .then(function(answer){
    connection.query(
        'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', 
        [answer.roleTitle, answer.roleSalary, answer.roleDepartment],
        function(err, results) {
            console.log (answer.roleTitle + " was added!")
            getAllRoles();
        })
    })
};

// Add an Employee
async function addEmployee() {
    var managersArr = [];
    function managerChoices() {
    connection.query("SELECT first_name, last_name FROM employees WHERE manager_id IS NULL", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

        })
        return managersArr;
    }
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        // .then(([roles, managers]) => {
            prompt([
            {
                type: "input",
                message: "What is this new employee's first name?",
                name: "employeeFirst",
                validate: answer => {
                    if (answer !== '') {
                        return true;
                    } 
                    return ('You must enter a first name for this employee!');
                }
            },
            {
                type: "input",
                message: "What is this new employee's last name?",
                name: "employeeLast",
                validate: answer => {
                    if (answer !== '') {
                        return true;
                    } 
                    return ('You must enter a last name for this employee!');
                }
            },
            {
                type: "list",
                message: "What is this new employee's role?",
                name: "employeeRole",
                choices: function() {
                    var roleArr = [];
                    for (let i = 0; i < res.length; i++) {
                        roleArr.push(res[i].title);
                    }
                    return roleArr;
                },
            },
            {
                type: "list",
                message: "What is the ID of the new employee's manager?",
                name: "employeeManager",
                choices: [1, 2, 3]
            }
        ])
        .then(function(answer){
            let roleId;

            for (i = 0; i < res.length; i++) {
                if (answer.employeeRole == res[i].title){
                    roleId = res[i].id;
                }
            }
            

        // Add the employee
        connection.query(
            "INSERT INTO employees SET ?",
            {
                first_name: answer.employeeFirst,
                last_name: answer.employeeFirst,
                role_id: roleId,
                manager_id: answer.employeeManager
            },
            function (err) {
                if (err) throw err;
                console.log("A new employee was added!");
                getAllEmployees();
            })
        })
    })
};

// Exit when user is done
function exitConnection() {
    console.log("Exiting...thank you!")
    connection.end();
}


