const db = require('./db/database');
const { prompt } = require('inquirer');
const cTable = require('console.table');
const connection = require('./db/database');

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
        'SELECT * FROM employees',
        function(err, results, fields) {
        console.table(employees); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
        }
    )
};

// // View all Employees
// async function getAllEmployees() {
//     const employees = await db.getAllEmployees();
//     console.table(employees);
//     loadMainPrompts();
// }

// Start server after DB connection
db.connect( (err) => {
    console.log(`Made connection`);
});

