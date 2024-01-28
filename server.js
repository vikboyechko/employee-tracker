const mysql = require('mysql2');
// const inquirer = require('inquirer');
const clear = require('clear');
const employeeTracker = require('./app/employeetracker.js');

// Connect to database
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'employee_db',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Database succesfully connected');
  //   db.end();
  // Wait 3 seconds, clear the message, run the Employee Tracker app
  //   setTimeout(() => {
  //     clear();
  //   }, 3000);
  employeeTracker(db);
});

module.exports = { mysql, inquirer, clear };
