#! /usr/bin/env node

const ora = require("ora");
const fs = require("fs");
const chalk = require("chalk");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stderr
});

console.log(chalk.blue("Deploying to Azure ☁️"));
let isDocker = false;
let isNode = false;

try {
  fs.accessSync("./Dockerfile", fs.constants.R_OK);
  isDocker = true;
  console.log(`${chalk.blue("Docker")} project detected.`);
} catch (e) {}

try {
  if (!isDocker) {
    fs.accessSync("./package.json", fs.constants.R_OK);
    isNode = true;
    console.log(`${chalk.green("Node.js")} project detected.`);
  }
} catch (e) {}

if (!isNode && !isDocker) {
  console.log(`${chalk.yellow("Static website")} project detected.`);
}

const pre = [
  "Compressing your project",
  "Installing dependencies from npm",
  "Starting your Node service",
  `Setting up staging at ${chalk.green(
    "https://fa32fea4b42-clouddemo.azurewebsites.net/"
  )}`
];
const post = [
  "Pointing brianholt.me at this deployment",
  "Shutting down the previous deployment"
];

const postDeploy = () => {
  rl.question(
    "❓ Look okay? Should we point brianholt.me to this deployment? [Y/n]",
    answer => {
      if (answer === "n") {
        return console.log(`${chalk.red("X")} Domain not moved.`);
        process.exit(1);
      }

      spinLines(post, () => {
        console.log(
          `${chalk.green("✔")} ${chalk.blue("Deployed to Azure successfully!")}`
        );
        process.exit(0);
      });
    }
  );
};

const spinLines = (lines, cb) => {
  const spinner = ora({
    text: lines[0],
    spinner: "weather",
    color: "green"
  });
  spinner.start();
  let current = 1;
  const interval = setInterval(() => {
    spinner.succeed();
    if (current >= lines.length) {
      spinner.stop();
      cb();
      return clearInterval(interval);
    }
    spinner.start(lines[current]);
    current++;
  }, 4000);
};

spinLines(pre, postDeploy);
