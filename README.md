# azw

This is a proof of concept and only covers the happy path. This wraps the `az webapp new` command. This has no useful error handling.

## Up and Running.

1. Install [az](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)
1. Install [the webapp extension](https://blogs.msdn.microsoft.com/appserviceteam/2018/02/06/az-webapp-new/)
1. Log in to az by running `az login`
1. Install azw by running `npm install --global azw`

## Use

`azw`

### Node project

This is the only command that works. No flags. No other commands. If azw detects a package.json, it will attempt to deploy your project and run whatever `npm start` says to do. [See here how to set that up](https://docs.npmjs.com/misc/scripts). Make sure you run `npm install` locally since it won't run that in the cloud. If you do not have process.json which is needed for pm2 then it will generate one for you.

### Static project

If you do not have a package.json, it assumes you want to do a static site deploy. This will create a package.json for you, auto-generate a project name, npm install, generate a process.json and then deploy it. It uses the [serve](https://github.com/zeit/serve) to do so which supports deep linking.

## ⚠️ Warning ⚠️

This is a proof concept. It will likely not be maintained. Since its proxying the output from the Python scripts, sometimes the spinner can freak out.
