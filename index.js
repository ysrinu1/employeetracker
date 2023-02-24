const  { prompt } = require('inquirer');
const db = require('./db');

require('console.table');

init();

function init() {
    loadMainPrompts();
}

function loadMainPrompts() {
    prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            {
                name: "View All Employees",
                value: "VIEW_EMPLOYEES"
            },
            {
                name: "View All Employees By Department",
                value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
            },
            {   name: "View All Employees By Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "View all Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
                name: "Remove Role",
                value: "REMOVE_ROLE"
            },
            {
                name: "Update Emplouee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "Quit",
                value: "QUIT"
            }
        ]
    }
    ]).then(res => {
        let choice= res.choice;
        switch (choice) {
          case "VIEW_EMPLOYEES":
            viewEmployees();
            break;
          case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            viewEmployeesByDepartment();
            break;
          case "VIEW_EMPLOYEES_BY_MANAGER":
            viewEmployeesByManager();
            break;
          case "ADD_EMPLOYEE":
            addEmployee();
            break;
          case "REMOVE_EMPLOYEE":
            removeEmployee();
            break;
          case "UPDATE_EMPLOYEE_ROLE":
            updateEmployeeRole();
            break;
          case "UPDATE_EMPLOYEE_MANAGER":
            updateEmployeeManager();
            break;
          case "VIEW_ROLES":
            viewRoles();
            break;
          case "ADD_ROLE":
            addRole();
            break;
          case "REMOVE_ROLE":
            removeRole();
            break;
          default:
            quit();
        }
      }
    )
}

// View all employees
function viewEmployees() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.log('\n');
        console.table(employees);
    })
    .then(() => loadMainPrompts());
}

// View all employees by department
function viewEmployeesByDepartment() {
  db.findAllEmployees()
  .then(([rows]) => {
    let departments = rows
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
  }));
    prompt([
      {
        type: 'list',
        name: 'departmentId',
        message: "Which department would you like to see employees for?",
        choices: departmentChoices
      }
    ])
      .then(res => db.findAllEmployeesByDepartment(res.departmentId))
      .then(([rows]) => {
        let employees = rows;
        console.log('\n');
        console.table(employees);
      })
      .then(() => loadMainPrompts());
    });
}

// view all employees by manager
function viewEmployeesByManager() {
    db.findAllEmployees()
    .then(([rows]) => {
        let managers = rows;
        const managerChoices = managers.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        prompt([
        {
            type: 'list',
            name: 'managerId',
            message: "Which manager would you like to see employees for?",
            choices: managerChoices
        }
        ])
        .then(res => db.findAllEmployeesByManager(res.managerId))
        .then(([rows]) => {
            let employees = rows;
            console.log('\n');
            console.table(employees);
        })
        .then(() => loadMainPrompts());
        });
    }

    // delete employee
    function removeEmployee() {
        db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: "Which employee would you like to remove?",
                    choices: employeeChoices
                }
            ])
            .then(res => db.removeEmployee(res.employeeId))
            .then(() => console.log("Removed employee from the database"))
            .then(() => loadMainPrompts());
        });
    }

    // Update employee role
    function updateEmployeeRole() {
        db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));
            prompt([
                {
                    type: 'list',
                    name: 'employeeId',
                    message: "Which employee's role would you like to update?",
                    choices: employeeChoices
                }
            ])
            .then(res => {
                let employeeId= res.employeeId;
                db.findallRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                      name: title,
                      value: id
                }));
                prompt([
                  {type: "list",
                  name: "roleId",
                  message: "Which role would you like to assign the selected employee?",
                  choices: roleChoices
                 }
                ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console.log("Updated employee's role"))
                .then(() => loadMainPrompts());
                });
            });
        })
    }

    // Exit the application
    function quit() {
        console.log("Goodbye!");
        process.exit();
    }