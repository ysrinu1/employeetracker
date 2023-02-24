const connection = require('./connection');

class DB {
    constructor(connection) {
        this.connection = connection;
    }
  findAllEmployees() {
    return this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;"
    );
  }

  findAllPossibleManagers(employeeId) {
    return this.connection.promise().query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId
    );
  }

//   Create a new employee
  createEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
  }

//   Remove an employee with the given id 
  removeEmployee(employeeId) {
    return this.connection.promise().query(
      "DELETE FROM employee WHERE id = ?",
        employeeId
    );
  }

//   Update the given employee's role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [roleId, employeeId]
    );
  }

//   Update the given employee's manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
    "UPDATE employee SET manager_id = ? WHERE id = ?",
    [managerId, employeeId]
    )
  }

}

module.exports = new DB(connection);
