const simpleGit = require('simple-git');
const git = simpleGit('D:/workSpace/jsproject/tungee/koala');
const process = require('process');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const { logErrOrData } = require('../logger')

function getConfigFilePath() {
  return process.env.HOME || process.env.USERPROFILE;
}


async function getParams() {
  try {
    const { workSpace } = await inquirer.prompt([{
      name: 'workSpace',
      message: '输入你的工作目录',
      validate: (answer) => {
        try {
          if (!answer || !fs.statSync(answer).isDirectory) {
            return '输入的路径不是合法的目录'
          }
        } catch {
          return '输入的路径不是合法的目录'
        }
      }
    }]);
    
    

  } catch(error) {
    throw error;
  }
}

git.branchLocal((err, branchs) => {
  // logErrOrData(err, branchs);
})

git.log({
  '--stat': true,
  '--since': '2020-08-01',
  '--until': '2020-08-15',
  '--author': 'tanxin'
}, (err, log) => {
  // logErrOrData(err, log);
});

getParams()