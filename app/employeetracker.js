const inquirer = require('inquirer');
const consoleTable = require('console.table');
const clear = require('clear');

function employeeTracker(db) {
  console.clear();
  console.log('*** EMPLOYEE TRACKER ***\n');

  const menuPrompt = [
    {
      type: 'list',
      message: 'What would you like to do?\n',
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
      console.clear();
      console.log('\n**Viewing All Departments**\n');
      db.query('SELECT * FROM department', function (err, results) {
        if (err) {
          console.error('Error executing the query:', err);
          returnToMenu(db);
        } else {
          console.table(results);
          returnToMenu(db);
        }
        // Continue using the db connection for other queries or operations
      });
    } else {
      //   db.end();
      return;
    }
  });
}

function returnToMenu(db) {
  const returnPrompt = [
    {
      type: 'list',
      message: '',
      choices: ['Return to Menu', 'Exit'],
      name: 'return',
    },
  ];
  inquirer.prompt(returnPrompt).then((response) => {
    if (response.return === 'Return to Menu') {
      employeeTracker(db);
    } else {
      console.clear();
      process.exit();
    }
  });
}

module.exports = employeeTracker;
