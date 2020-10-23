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
                   value: 'VIEW_EMPLOYEES'
               }
           ]
       } 
    ])
};

// Start server after DB connection
db.connect( (err) => {
    console.log(`Made connection`);
});

