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
    // View All Departments
    if (response.menu === 'View All Departments') {
      console.clear();
      console.log('\n** Viewing All Departments **\n');
      db.query(
        `
      
      SELECT * FROM department
      
      
      `,
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results);
            returnToMenu(db);
          }
        }
      );

      // View All Roles
    } else if (response.menu === 'View All Roles') {
      console.clear();
      console.log('\n** Viewing All Roles **\n');
      db.query(
        `
        
        SELECT * FROM role
        
        `,
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results);
            returnToMenu(db);
          }
        }
      );

      // View All Employees
    } else if (response.menu === 'View All Employees') {
      console.clear();
      console.log('\n** Viewing All Employees **\n');
      db.query(
        `
          
          SELECT * FROM employee
          
          `,
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results);
            returnToMenu(db);
          }
        }
      );

      // Add Department
    } else if (response.menu === 'Add Department') {
      console.clear();
      console.log('\n** Add Department **\n');
      inquirer
        .prompt([
          {
            type: 'input',
            message: 'New Department Name: ',
            name: 'name',
          },
        ])
        .then((response) => {
          const departmentName = response.name;

          db.query(
            `
                    
                    INSERT INTO department (name)
                    VALUES
                        (?)
                    
                    `,
            [departmentName],
            function (err, results) {
              if (err) {
                console.error('Error executing the query:', err);
                returnToMenu(db);
              } else {
                console.table(results);
                returnToMenu(db);
              }
            }
          );
        });

      // Add Role
    } else if (response.menu === 'Add Role') {
      console.clear();
      console.log('\n** Add Role **\n');
      inquirer
      .prompt([
        {
          type: 'input',
          message: 'New Role Title: ',
          name: 'title',
        },
        {
            type: 'input',
            message: 'Salary: '
            name: 'salary',
        }
        {
            type: 'input',
            message: 'Department: ',
            name: 'department',
        }

      ])
      .then((response) => {
        const roleTitle = response.name;

        db.query(
          `
                  
                  INSERT INTO role (title)
                  VALUES
                      (?)
                  
                  `,
          [roleTitle],
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results);
            returnToMenu(db);
          }
        }
      );

      // Add Employee
    } else if (response.menu === 'Add Employee') {
      console.clear();
      console.log('\n** Add Employee **\n');
      db.query(
        `
            
            SELECT * FROM employee
            
            `,
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results);
            returnToMenu(db);
          }
        }
      );

      // Update Employee Role
    } else if (response.menu === 'Update Employee Role') {
      console.clear();
      console.log('\n** Update Employee Role **\n');
      db.query(
        `
            
            SELECT * FROM employee
            
            `,
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results);
            returnToMenu(db);
          }
        }
      );
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
