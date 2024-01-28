const inquirer = require('inquirer');
const consoleTable = require('console.table');
const clear = require('clear');

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

const newDepartmentPrompt = [
  {
    type: 'input',
    message: 'New Department Name: ',
    name: 'name',
  },
];

// Function to get department choices
function getDepartmentChoices(db) {
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
          const choices = results.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          resolve(choices);
        }
      }
    );
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

function employeeTracker(db) {
  console.clear();
  console.log('*** EMPLOYEE TRACKER ***\n');

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

      inquirer.prompt(newDepartmentPrompt).then((response) => {
        const departmentName = response.name;
        db.query(
          `
          INSERT INTO department (name)
          VALUES (?)
          `,
          [departmentName],
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

      // Add Role
    } else if (response.menu === 'Add Role') {
      // have to add this inside the if statement so that the db is passed to getDepartmentChoices
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
            return getDepartmentChoices(db); // Pass db to getDepartmentChoices
          },
        },
      ];

      console.clear();
      console.log('\n** Add Role **\n');

      inquirer.prompt(newRolePrompt).then((response) => {
        const roleTitle = response.title;
        const roleSalary = response.salary;
        const roleDepartment = response.department;

        db.query(
          `
          INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?)
          `,
          [roleTitle, roleSalary, roleDepartment],
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

      // ADD EMPLOYEE SECTION
    } else if (response.menu === 'Add Employee') {
      console.clear();
      console.log('\n** Add Employee **\n');

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

            inquirer.prompt(newEmployeePrompt).then((response) => {
              const employeeFirstName = response.firstname;
              const employeeLastName = response.lastname;
              const employeeRole = response.role;
              const employeeManager = response.manager;

              db.query(
                `
                INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)
                `,
                [employeeFirstName, employeeLastName, employeeRole, employeeManager],
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
    }
  });
}

module.exports = employeeTracker;
