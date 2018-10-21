const fs = require('fs');
const inquirer = require('inquirer')
const chalk = require('chalk');
const isUrl = require('is-url');
const axios = require('axios');
const url = require('url');

const pathFile = fs.readFileSync(__dirname + '/admin-pages.txt', 'utf-8');
const paths = pathFile.split("\n");

const pathsCount = paths.length;

const checkExistance = async (urlToCheck) => {
    try {
        await axios.get(urlToCheck);
        console.log(chalk`{green ✓}`, urlToCheck, chalk`{green exists}`);
        return true;
    } catch (e) {
        console.log(chalk`{red ×}`, urlToCheck, chalk`{red doesn't exist}`);
        return false;
    }
}

const startSearching = async (websiteUrl, from = 0 , to = pathsCount) => {
    const foundUrls = [];
    let startTime, sumOfTimes = 0, countOfTimes = 0;
    for (let i = from; i < to; i++) {
        startTime = Date.now();
        const urlToCheck = url.resolve(websiteUrl, paths[i]);
        const found = await checkExistance(urlToCheck);
        if (found) foundUrls.push(urlToCheck);
        countOfTimes++;
        sumOfTimes += Date.now() - startTime;
        const avgTime = sumOfTimes / countOfTimes;
        const remainingTime = Math.floor((to - i) * avgTime / 1000);
        const remainingToStr = `${Math.floor(remainingTime / 60)}m and ${remainingTime % 60}s`
        console.log(chalk`{magenta (${i + 1} out of ${pathsCount} | ERT: ${remainingToStr} | ${foundUrls.length} FOUND)}`);
    }
    return foundUrls;
}

const cliStart = async () => {
    const data = await inquirer.prompt([{ name: 'websiteUrl', message: `Enter the root url of website:` }]);
    const websiteUrl = data.websiteUrl;
    if (!isUrl(websiteUrl)) {
        return console.log(chalk`{red × entered url is not valid}`);
    } else {
        const urls = await startSearching(websiteUrl);
        if (urls.length === 0) {
            console.log(chalk`{red == NO ADMIN PAGE WAS FOUND == }`)
        } else {
            console.log(chalk`{green == ${urls.length} URLs WERE FOUND == }`);
            for (let url of urls) console.log(chalk`{green > }`, url);
        }
    }
}

cliStart();