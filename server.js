const mysql = require('mysql2');
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
  employeeTracker(db);
});
