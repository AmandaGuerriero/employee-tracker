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

// Global Arrays
// Roles Array
var roleArr = [];
function selectRole() {
  connection.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push({name: res[i].title, value: res[i].id});
    }

  })
  return roleArr;
};

var managerArr = [];
function selectManager() {
  connection.query("SELECT employees.first_name, employees.last_name, employees.id FROM employees WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
        managerArr.push({name: res[i].last_name + ", " + res[i].first_name, value: res[i].id});
    }

  })
  return managerArr;
};

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
                    name: 'Update role for an Employee',
                    value: 'UPDATE_ROLE'
                },
                {
                    name: 'Update manager for an Employee',
                    value: 'UPDATE_MANAGER'
                },
                {
                    name: 'Remove a Department',
                    value: 'REMOVE_DEPARTMENT'
                },
                {
                    name: 'Remove a Role',
                    value: 'REMOVE_ROLE'
                },
                {
                    name: 'Remove an Employee',
                    value: 'REMOVE_EMPLOYEE'
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
        case 'UPDATE_ROLE':
            return updateRole();
        case 'UPDATE_MANAGER':
            return updateManager();
        case 'REMOVE_DEPARTMENT':
            return removeDepartment();
        case 'REMOVE_ROLE':
            return removeRole();
        case 'REMOVE_EMPLOYEE':
            return removeEmployee();
        case 'DONE':
            return exitConnection();
    }
};

// View all Departments
async function getAllDepartments() {
    connection.query(
        'SELECT departments.id AS "Department ID", name AS "Department Name" FROM departments ORDER BY departments.id ASC;',
        function(err, results, fields) {
            console.table(results); 
            loadMainPrompts();
        }
    )
};

// View all Roles
async function getAllRoles() {
    connection.query(
        'SELECT title AS "Job Title", roles.id AS "Role ID", departments.name AS "Department Name", salary AS "Salary" FROM roles LEFT JOIN departments ON roles.department_id = departments.id ORDER BY roles.id ASC',
        function(err, results, fields) {
            console.table(results); 
            loadMainPrompts();
        }
    )
};

// View all Employees
async function getAllEmployees() {
    connection.query(
        `SELECT employees.id AS "Employee ID", employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS Title, departments.name AS Department, roles.salary AS Salary, CONCAT(manager.first_name,' ', manager.last_name) AS Manager FROM employees LEFT JOIN roles on employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id;`,
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
            console.log (answer.departmentName + " was added!")
            getAllDepartments();
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
            message: "What is the Department id for this role?",
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
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
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
                choices: selectRole()
            },
            {
                type: "list",
                message: "What is the ID of the new employee's manager?",
                name: "employeeManager",
                choices: selectManager()
            }
        ])
        .then(function(answer){
 
        // Add the employee
        connection.query(
            "INSERT INTO employees SET ?",
            {
                first_name: answer.employeeFirst,
                last_name: answer.employeeLast,
                role_id: answer.employeeRole,
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

// Update an employee's role
async function updateRole() {
    connection.query('SELECT employees.first_name, employees.last_name, employees.id, roles.title FROM employees JOIN roles ON employees.role_id = roles.id;', function(err, res) {
     if (err) throw err
     var employeeArr = [];
     for (var i = 0; i < res.length; i++) {
        employeeArr.push({name: res[i].last_name + ", " + res[i].first_name, value: res[i].id});
      }
     prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's role would you like to change? ",
            choices: employeeArr
          },
          {
            type: "list",
            name: "newRole",
            message: "What is the new role of the Employee? ",
            choices: selectRole()
          },
      ]).then(function(answer) {

        connection.query(`UPDATE employees SET role_id = ${answer.newRole} WHERE id = ${answer.employeeId}`, (err, res) => {
            getAllEmployees();
            if (err) return err;
        });
    })
    })
};

// Update an employee's manager
async function updateManager() {
    connection.query('SELECT employees.first_name, employees.last_name, employees.id, employees.manager_id FROM employees;', function(err, res) {
     if (err) throw err
     var employeeArr = [];
     for (var i = 0; i < res.length; i++) {
        employeeArr.push({name: res[i].last_name + ", " + res[i].first_name, value: res[i].id});
      }
     prompt([
          {
            type: "list",
            name: "employeeId",
            message: "Which employee's manager should be changed? ",
            choices: employeeArr
          },
          {
            type: "list",
            name: "newManager",
            message: "Who is the new manager for the employee? ",
            choices: selectManager()
          },
      ]).then(function(answer) {

        connection.query(`UPDATE employees SET manager_id = ${answer.newManager} WHERE id = ${answer.employeeId}`, (err, res) => {
            getAllEmployees();
            if (err) return err;
        });
    })
    })
};

// Remove Department
async function removeDepartment() {
    connection.query(
        `DELETE FROM departments where ?;`,
        function(err, results, fields) {
            prompt([
                {
                    type: 'input',
                    name: 'removeDep',
                    message: 'Input the Department Id to remove it'
                }
            ])
            .then((answer) => {
                connection.query(`DELETE FROM departments where ?`, { id: answer.removeDep })
                console.log ("A department was removed!")
                getAllDepartments();
        }
            )}
    )
};

// Remove Role
async function removeRole() {
    connection.query(
        `DELETE FROM roles where ?;`,
        function(err, results, fields) {
            prompt([
                {
                    type: 'input',
                    name: 'removeRole',
                    message: 'Input the Role Id to remove it'
                }
            ])
            .then((answer) => {
                connection.query(`DELETE FROM roles where ?`, { id: answer.removeRole })
                console.log ("A role was removed!")
                getAllRoles();
        }
            )}
    )
};

// Remove Employee
async function removeEmployee() {
    connection.query(
        `DELETE FROM employees where ?;`,
        function(err, results, fields) {
            prompt([
                {
                    type: 'input',
                    name: 'removeEmp',
                    message: 'Input the Employee Id to remove them'
                }
            ])
            .then((answer) => {
                connection.query(`DELETE FROM employees where ?`, { id: answer.removeEmp })
                console.log ("An employee was removed!")
                getAllEmployees();
        }
            )}
    )
};

// Exit when user is done
function exitConnection() {
    console.log("Exiting...thank you!")
    connection.end();
};


