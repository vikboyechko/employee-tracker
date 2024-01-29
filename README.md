# Employee Tracker

This is a command-line app that allows users to manage departments, employees, and staff roles from a Node.js terminal. The project uses safe MySQL queries via Inquirer prompts to create, read, and edit database entries.

And because it's a backend CLI app, it uses a package to display MySQL tables nicely inside the terminal, and another package to clear the terminal after an action has been made, which enhances the user experience.

[Watch a video demonstration of the app](https://app.screencastify.com/v3/watch/y1BIvqYSCGnzXDB4ISGe)

![Employee Tracker Screenshot](/employee-tracker-app.jpg)

## Installation

The app is conveniently split into two files to make it easier to use and enhance the app. A lightweight server.js file contains the connection details to the MySQL database, and an employeetracker.js file with all of the app functions. In addition, there is a schema.sql file to create the database and essential tables.

To install the app, fork the repository, customize your database login information in server.js, run 'npm i' to install the dependencies, initialize the database and tables using the handy schema.sql file, and then run 'node server.js' to start the app.
