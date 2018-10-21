const fs = require('fs');
const inquirer = require('inquirer')
const chalk = require('chalk');
const isUrl = require('is-url');
const axios = require('axios');
const url = require('url');

const pathFile = fs.readFileSync(__dirname + '/admin-pages.txt', 'utf-8');
const paths = pathFile.split("\n");

const pathsCount = paths.length;

const checkExistance = async (websiteUrl, path) => {
    const urlToCheck = url.resolve(websiteUrl, path);
    try {
        await axios.get(urlToCheck);
        console.log(chalk`{green ✓}`, urlToCheck, chalk`{green exists}`);
    } catch (e) {
        console.log(chalk`{red ×}`, urlToCheck, chalk`{red doesn't exist}`);
        return false;
    }
}

const startSearching = async (websiteUrl, from = 0 , to = pathsCount) => {
    for (let i = from; i < to; i++) await checkExistance(websiteUrl, paths[i]);
}

const cliStart = async () => {
    const data = await inquirer.prompt([{ name: 'websiteUrl', message: `Enter the root url of website:` }]);
    const websiteUrl = data.websiteUrl;
    if (!isUrl(websiteUrl)) {
        return chalk`{red × entered url is not valid}`;
    } else {
        await startSearching(websiteUrl);
    }
}

cliStart();