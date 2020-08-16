const simpleGit = require('simple-git');

const process = require('process');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const { logErrOrData } = require('../logger');

function getConfigFilePath() {
  return process.env.HOME || process.env.USERPROFILE;
}

async function getBranchList(workSpace, projectAndBranchList, index) {
  prj = projectAndBranchList[index];
  prj.git = simpleGit(path.join(workSpace, prj.name));
  const { name, git } = prj;
  const allBranchList = await git.branchLocal();
  const { branchList } = await inquirer.prompt({
    name: 'branchList',
    message: `请选择${name}要统计的分支，空格选择，回车结束选择`,
    type: 'checkbox',
    choices: allBranchList.all,
    validate: checkedList => {
      return checkedList.length > 0 || '请选择至少一个分支';
    }
  });
  prj.branchs = branchList.map(branch => ({
    name: branch,
    log: []
  }));
  if (index < projectAndBranchList.length - 1) {
    await getBranchList(workSpace, projectAndBranchList, index + 1);
  } else {
    return projectAndBranchList;
  }
}

function formartTime(time) {
  return `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}`;
}


async function getBranchListLog(proInfo, branchIndex, timeDuration) {
  const branch = proInfo.branchs[branchIndex];
  const git = proInfo.git;
  await git.checkout(branch);
  const log = await git.log({
      '--stat': true,
      '--since': timeDuration[0],
      '--until': timeDuration[1],
      '--author': 'tanxin'
    });
  proInfo.log.push(log);
  console.log(log);
  if (branchIndex < proInfo.branchs.length - 1) {
    await getBranchListLog(proInfo, branchIndex + 1, timeDuration);
  }
}

async function getProjectCodeNum(projectAndBranchList, index, timeDuration) {
  const prjInfo = projectAndBranchList[index];

  await getBranchListLog(prjInfo, 0, timeDuration);

  if (index < projectAndBranchList.length - 1) {
    await getProjectCodeNum(projectAndBranchList, index + 1, timeDuration);
  }
}

async function getParams() {
  try {
    const { workSpace } = await inquirer.prompt([{
      name: 'workSpace',
      message: '输入你的工作目录',
      validate: answer => {
        try {
          if (!answer || !fs.statSync(answer).isDirectory) {
            return '输入的路径不是合法的目录';
          }
          return true;
        } catch {
          return '输入的路径不是合法的目录';
        }
      }
    }]);
    
    const dirList = fs.readdirSync(workSpace);
    const gitProjectList = dirList.filter(dir => {
      const prjPath = path.join(workSpace, dir);
      return fs.statSync(prjPath).isDirectory() && fs.readdirSync(prjPath).find(subDir => subDir === '.git')
    });
    const { projectList } = await inquirer.prompt({
      name: 'projectList',
      message: '请选择要统计的项目，空格选择，回车结束选择',
      type: 'checkbox',
      choices: gitProjectList,
      validate: checkedList => {
        return checkedList.length > 0 || '请选择至少一个项目';
      }
    })

    const projectAndBranchList = projectList.map(prj => ({
      name: prj,
      branchs: [],
      git: null,
      total: {
        add: 0,
        sub: 0,
        total: 0
      }
    }));
    
    const { fromDay } = await inquirer.prompt([{
      name: 'fromDay',
      message: '输入统计区间的开始日期，格式如 2020-01-01',
      validate: answer => {
        return true;
      }
    }]);

    const { endDay } = await inquirer.prompt([{
      name: 'endDay',
      message: '输入统计区间的结束日期，格式如 2020-01-08',
      validate: answer => {
        return true;
      }
    }]); 

    await getBranchList(workSpace, projectAndBranchList, 0);
    
    let totalAdd = 0, totalSub = 0, total = 0;
    await getProjectCodeNum(projectAndBranchList, 0, [fromDay, endDay]);


    console.log(projectAndBranchList);
    
  } catch(error) {
    throw error;
  }
}



const p = 'D:/jsProject/nodejsProject'

// git.branchLocal((err, branchs) => {
//   // logErrOrData(err, branchs);
// })

// git.log({
//   '--stat': true,
//   '--since': '2020-08-01',
//   '--until': '2020-08-15',
//   '--author': 'tanxin'
// }, (err, log) => {
//   // logErrOrData(err, log);
// });

getParams()