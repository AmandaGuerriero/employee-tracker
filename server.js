const db = require('./db/database');
const { prompt } = require('inquirer');
const cTable = require('console.table');
const connection = require('./db/database');

const PORT = process.env.PORT || 3001;

// Start server after DB connection
db.connect( (err) => {
    console.log(`Made connection`);
    init();
});


