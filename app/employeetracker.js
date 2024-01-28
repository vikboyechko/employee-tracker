const inquirer = require('inquirer');
const consoleTable = require('console.table'); // package to print mysql rows to console
const clear = require('clear'); // package to clear the console after actions

// Prompt for the main menu, makes it easier to add new options later
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
      'Exit',
    ],
  },
];

// Function to get department choices from the DB, for the Add Role menu option, but could be used elsewhere
function getDepartmentChoices(db) {
  // i use a promise because the inquirer prompt needs to wait for the db query to finish
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT * FROM department
      `,
      function (err, results) {
        if (err) {
          console.error('Error executing the query:', err);
          reject(err);
        } else {
          // each department is an object with id and name properties
          const choices = results.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          // resolve the promise with the choices
          resolve(choices);
        }
      }
    );
  });
}

// Function to return to the main menu or exit after any action is taken
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
      console.clear(); // clears the console
      process.exit(); // exits the node app
    }
  });
}

// The main app, takes the db connection as an argument from server.js
function employeeTracker(db) {
  console.clear();
  console.log('*** EMPLOYEE TRACKER ***\n');

  inquirer.prompt(menuPrompt).then((response) => {
    //
    // BEGIN VIEW ALL DEPARTMENTS SECTION
    if (response.menu === 'View All Departments') {
      console.clear();
      console.log('\n** Viewing All Departments **\n');

      // simple query to get all departments
      db.query(
        `
      SELECT * FROM department
      `,
        function (err, results) {
          if (err) {
            console.error('Error executing the query:', err);
            returnToMenu(db);
          } else {
            console.table(results); // prints the results to the console using the console.table package
            returnToMenu(db);
          }
        }
      );
      // END VIEW ALL DEPARTMENTS SECTION
      //
      // BEGIN VIEW ALL ROLES SECTION
    } else if (response.menu === 'View All Roles') {
      console.clear();
      console.log('\n** Viewing All Roles **\n');

      // simple query to get all roles
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
      // END VIEW ALL ROLES SECTION
      //
      // BEGIN VIEW ALL EMPLOYEES SECTION
    } else if (response.menu === 'View All Employees') {
      console.clear();
      console.log('\n** Viewing All Employees **\n');

      // simple query to get all employees
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
      // END VIEW ALL EMPLOYEES SECTION
      //
      // BEGIN ADD DEPARTMENT SECTION
    } else if (response.menu === 'Add Department') {
      console.clear();
      console.log('\n** Add Department **\n');

      // prompt for the new department name
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

          // insert the new departmentName into the db
          db.query(
            `
          INSERT INTO department (name)
          VALUES (?)
          `,
            [departmentName],
            // callback function to handle errors and success
            function (err, results) {
              if (err) {
                console.error('Error executing the query:', err);
                returnToMenu(db);
              } else {
                console.log('Department added successfully');
                returnToMenu(db);
              }
            }
          );
        });
      // END ADD DEPARTMENT SECTION
      //
      // BEGIN ADD ROLE SECTION
    } else if (response.menu === 'Add Role') {
      console.clear();
      console.log('\n** Add Role **\n');

      // prompt for the new role info
      const newRolePrompt = [
        {
          type: 'input',
          message: 'New Role Title: ',
          name: 'title',
        },
        {
          type: 'input',
          message: 'Salary: ',
          name: 'salary',
        },
        {
          type: 'list',
          message: 'Select Department: ',
          name: 'department',
          choices: function () {
            return getDepartmentChoices(db); // Pass db to the getDepartmentChoices function to get the list of departments
          },
        },
      ];

      // after the prompts are answered, assign responses to values and insert into the db
      inquirer.prompt(newRolePrompt).then((response) => {
        const roleTitle = response.title;
        const roleSalary = response.salary;
        const roleDepartment = response.department;

        // insert multiple values using ? placeholders and an array of values
        db.query(
          `
          INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?)
          `,
          [roleTitle, roleSalary, roleDepartment],

          // callback function to handle errors and success
          function (err, results) {
            if (err) {
              console.error('Error executing the query:', err);
              returnToMenu(db);
            } else {
              console.log('Role added successfully');
              returnToMenu(db);
            }
          }
        );
      });
      // END ADD ROLE SECTION
      //
      // ADD EMPLOYEE SECTION
    } else if (response.menu === 'Add Employee') {
      console.clear();
      console.log('\n** Add Employee **\n');

      // declare variables to hold the lists of roles and employees
      let rolesList = [];
      let employeesList = [];

      // get latest roles from the db
      db.query(
        `
        SELECT id, title FROM role
        `,
        function (error, results) {
          if (error) {
            console.error('Error executing the query:', error);
            returnToMenu(db);
          }
          // map the results to an array of objects with name and value properties, and a None option
          rolesList = [
            { name: 'None', value: null },
            ...results.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          ];
        }
      );

      // get latest employees from the db
      db.query(
        `
        SELECT id, first_name, last_name FROM employee
        `,
        function (error, results) {
          if (error) {
            console.error('Error executing the query:', error);
          } else {
            // map the results to array, with employee first and last name concatenated, and a None option
            employeesList = [
              { name: 'None', value: null },
              ...results.map((employee) => ({
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
              })),
            ];

            // now we can use the roles and employees lists to prompt for the new employee info
            const newEmployeePrompt = [
              {
                type: 'input',
                message: 'New Employee First Name: ',
                name: 'firstname',
              },
              {
                type: 'input',
                message: 'New Employee Last Name: ',
                name: 'lastname',
              },
              {
                type: 'list',
                message: 'Select Role: ',
                name: 'role',
                choices: rolesList,
              },
              {
                type: 'list',
                message: 'Select Manager: ',
                name: 'manager',
                choices: employeesList,
              },
            ];

            // after the prompts are answered, assign responses to values and insert into the db
            inquirer.prompt(newEmployeePrompt).then((response) => {
              const employeeFirstName = response.firstname;
              const employeeLastName = response.lastname;
              const employeeRole = response.role;
              const employeeManager = response.manager;

              // insert multiple values using placeholders into the employee table
              db.query(
                `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)
                `,
                [employeeFirstName, employeeLastName, employeeRole, employeeManager],

                // callback function to handle errors and success
                function (err, results) {
                  if (err) {
                    console.error('Error executing the query:', err);
                    returnToMenu(db);
                  } else {
                    console.log('Employee added successfully');
                    returnToMenu(db);
                  }
                }
              );
            });
          }
        }
      );
      // END ADD EMPLOYEE SECTION
      //
      // BEGIN UPDATE EMPLOYEE ROLE SECTION
    } else if (response.menu === 'Update Employee Role') {
      console.clear();
      console.log('\n** Update Employee Role **\n');

      // this section is similar to the Add Employee section, but with a different inquirer prompt

      let rolesList = [];
      let employeesList = [];

      // get latest roles from the db
      db.query(
        `
        SELECT id, title FROM role
        `,
        function (error, results) {
          if (error) {
            console.error('Error executing the query:', error);
            returnToMenu(db);
          }
          rolesList = [
            { name: 'None', value: null },
            ...results.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          ];
        }
      );

      // get latest employees from the db
      db.query(
        `
        SELECT id, first_name, last_name FROM employee
        `,
        function (error, results) {
          if (error) {
            console.error('Error executing the query:', error);
          } else {
            employeesList = [
              { name: 'None', value: null },
              ...results.map((employee) => ({
                name: employee.first_name + ' ' + employee.last_name,
                value: employee.id,
              })),
            ];

            const updateEmployeePrompt = [
              {
                type: 'list',
                message: 'Select Employee to Update Role: ',
                name: 'employee',
                choices: employeesList,
              },
              {
                type: 'list',
                message: 'Select Role to Assign to Employee: ',
                name: 'role',
                choices: rolesList,
              },
            ];

            // now we can take the prompt responses and update the employee role in the db
            inquirer.prompt(updateEmployeePrompt).then((response) => {
              const employee = response.employee;
              const employeeRole = response.role;

              db.query(
                `
                UPDATE employee
                SET role_id = ?
                WHERE id = ?
                `,
                [employeeRole, employee],

                // callback function to handle errors and success
                function (err, results) {
                  if (err) {
                    console.error('Error executing the query:', err);
                    returnToMenu(db);
                  } else {
                    console.log('Employee role updated successfully');
                    returnToMenu(db);
                  }
                }
              );
            });
          }
        }
      );
      // END UPDATE EMPLOYEE ROLE SECTION
      //
      // BEGIN EXIT SECTION
    } else if (response.menu === 'Exit') {
      console.clear();
      process.exit();
    }
  });
}

// export the employeeTracker function so it can be used in server.js
module.exports = employeeTracker;
