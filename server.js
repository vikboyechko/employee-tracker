// This file is the entry point for the application. It connects to the database and then calls the employeeTracker function from the employeetracker.js file.
// We can also use this file to start the server if we wanted to add a front end to the application.

const mysql = require('mysql2');
const employeeTracker = require('./app/employeetracker.js');

// Connect to database
// Better to hide the password and other sensitive information in a .env file, future improvement
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
  employeeTracker(db); // calls the main function from the employeetracker.js file
});
