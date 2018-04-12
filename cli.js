#! /usr/bin/env node

const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");

const cwdPath = (...paths) => path.resolve(process.cwd(), ...paths);
const pkgPath = (...paths) => path.resolve(__dirname, ...paths);

const spinner = ora({
  spinner: "weather",
  color: "green"
});
spinner.info(chalk.blue("️️Deploying to Azure ☁️"));
spinner.start("Starting deploy");

let isNode = false;
let package;
try {
  let packageBuffer = fs.readFileSync(cwdPath("./package.json"));
  package = JSON.parse(packageBuffer);
  isNode = true;
  spinner.succeed();
  spinner.info(`${chalk.green("Node.js")} project detected.`);
  finishUp();
} catch (e) {
  package = require("./generatePackageName");
  spinner.succeed();
  spinner.info(`${chalk.yellow("Static site")} project detected.`);
  spinner.start("Generating package.json");
  fs.writeFileSync(cwdPath("./package.json"), JSON.stringify(package, null, 2));
  spinner.succeed();
  spinner.start("Running npm install");
  const install = exec(
    "npm install --loglevel=silent",
    {
      cwd: cwdPath(".")
    },
    () => {
      spinner.succeed();
      finishUp();
    }
  );
}

function finishUp() {
  let hasProcess = false;
  try {
    fs.accessSync("./process.json", fs.constants.R_OK);
    hasProcess = true;
  } catch (e) {}

  if (!hasProcess) {
    spinner.start("Generating process.json");
    fs.writeFileSync(
      cwdPath("./process.json"),
      JSON.stringify(require("./generateProcess"), null, 4)
    );
  }

  const az = spawn("az", ["webapp", "up", "-n", package.name]);

  az.stderr.on("data", data => {
    const string = data.toString();
    spinner.succeed();
    if (string.startsWith("WARNING: All done.")) {
      spinner.info(
        `See your app at ${chalk.yellow(
          `http://${package.name}.azurewebsites.net`
        )}`
      );
    } else {
      spinner.start(
        data
          .toString()
          .replace("WARNING: ", "")
          .trim()
      );
    }
  });

  az.on("close", code => {
    if (code === 0) {
      spinner.succeed(`${chalk.blue("Deployed to Azure successfully! ☁️")}`);
    } else {
      spinner.fail(`${chalk.yellow("Deployment failed")}`);
    }
  });
}
