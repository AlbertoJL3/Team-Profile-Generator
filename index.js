const inquirer = require("inquirer");
const fs = require("fs");

const Employee = require("./Employee");
const Manager = require("./Manager");
const Engineer = require("./Engineer");
const Intern = require("./Intern");

const questions = [
  {
    type: "input",
    name: "name",
    message: "What is the employee's name?",
  },
  {
    type: "input",
    name: "id",
    message: "What is the employee's ID?",
    validate: function (input) {
      if (!Number.isInteger(parseInt(input))) {
        return "Please enter a valid integer for the ID";
      }
      return true;
    },
  },
  {
    type: "input",
    name: "email",
    message: "What is the employee's email?",
    validate: function (input) {
      if (!/\S+@\S+\.\S+/.test(input)) {
        return "Please enter a valid email address";
      }
      return true;
    },
  },
  {
    type: "list",
    name: "role",
    message: "What is the employee's role?",
    choices: ["Manager", "Engineer", "Intern"],
  },
  {
    type: "input",
    name: "officeNumber",
    message: "What is the manager's office number?",
    when: function (answers) {
      return answers.role === "Manager";
    },
  },
  {
    type: "input",
    name: "github",
    message: "What is the engineer's GitHub username?",
    when: function (answers) {
      return answers.role === "Engineer";
    },
  },
  {
    type: "input",
    name: "school",
    message: "What school does the intern attend?",
    when: function (answers) {
      return answers.role === "Intern";
    },
  },
];

inquirer.prompt(questions).then((answers) => {
  let employee;
  switch (answers.role) {
    case "Manager":
      employee = new Manager(
        answers.name,
        answers.id,
        answers.email,
        answers.officeNumber
      );
      break;
    case "Engineer":
      employee = new Engineer(
        answers.name,
        answers.id,
        answers.email,
        answers.github
      );
      break;
    case "Intern":
      employee = new Intern(
        answers.name,
        answers.id,
        answers.email,
        answers.school
      );
      break;
    default:
      employee = new Employee(answers.name, answers.id, answers.email);
  }

  const html = generateHTML(employee);
  fs.writeFileSync("index.html", html);

  console.log("Successfully generated index.html!");
});

function generateHTML(employee) {
  let html = `
    <div>
      <h2>${employee.getName()}</h2>
      <p>ID: ${employee.getId()}</p>
      <p>Email: <a href="mailto:${employee.getEmail()}">${employee.getEmail()}</a></p>
      <p>Role: ${employee.getRole()}</p>
  `;
  if (employee.getRole() === "Manager") {
    html += `
      <p>Office Number: ${employee.officeNumber}</p>
    `;
  } else if (employee.getRole() === "Engineer") {
    html += `
      <p>GitHub: <a href="https://github.com/${employee.github}">${employee.github}</a></p>
    `;
  } else if (employee.getRole() === "Intern") {
    html += `<p>School: ${employee.school}</p>`;
    }
};