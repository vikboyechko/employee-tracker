const inquirer = require('inquirer');
const consoleTable = require('console.table');

function employeeTracker(db) {
  console.log('*** EMPLOYEE TRACKER ***\n');

  const menuPrompt = [
    {
      type: 'list',
      message: 'What would you like to do?',
      prefix: '(use arrow keys)',
      name: 'menu',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
      ],
    },
  ];

  inquirer.prompt(menuPrompt).then((response) => {
    if (response.menu === 'View All Departments') {
      console.log('Viewing All Departments');
      db.query('SELECT * FROM categories', function (err, results) {
        if (err) {
          console.error('Error executing the query:', err);
        } else {
          console.table(results);
        }
        // Continue using the db connection for other queries or operations
      });
    } else {
      //   db.end();
      return;
    }
  });
}

module.exports = employeeTracker;
