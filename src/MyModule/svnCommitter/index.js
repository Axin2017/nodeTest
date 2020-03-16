const fs = require('fs')
const path = require('path')
const cmd = require('node-cmd')
const ora = require('ora')
const inquirer = require('inquirer')


/**
 * 拷贝src文件夹代码到dest文件夹
 *
 * @param {String} src 源文件夹
 * @param {String} dest 目标文件夹
 * @param {Function} callback 拷贝完之后的回调
 */
function CopyDirectory(src, dest, callback) {
  if (src.indexOf('.svn') >= 0) {
    callback && callback()
    return
  }
  try {
    const srcStats = fs.statSync(src)
  } catch (e) {
    throw new Error('the source directory is not exit!')
  }
  try {
    const destStats = fs.statSync(dest)
  } catch (e) {
    fs.mkdirSync(dest)
  }
  const dirs = fs.readdirSync(src)
  dirs.forEach(function (item) {
    const itemPath = path.join(src, item)
    const temp = fs.statSync(itemPath)
    if (temp.isFile()) { // 是文件
      fs.copyFileSync(itemPath, path.join(dest, item))
    } else if (temp.isDirectory()) { // 是目录
      CopyDirectory(itemPath, path.join(dest, item))
    }
  })

  callback && callback()
}

/**
 * 删除svn目录里面的源代码并提交
 *
 * @param {String} dest 目标文件夹（svn项目目录）
 * @param {String} desc 本次提交的描述
 * @param {Function} callback 删除代码并提交后的回调
 */
function removeSvnDir(dest, desc, callback) {

  const dirs = fs.readdirSync(dest)

  let svnDirIndex = -1
  const dirPaths = dirs.map((dir, i) => {
    const itemPath = path.join(dest, dir)
    if (dir.indexOf('.svn') >= 0) {
      svnDirIndex = i
    }
    return `"${itemPath}"`
  })
  if (svnDirIndex >= 0) {
    dirPaths.splice(svnDirIndex, 1)
  }

  const deleteConmmand = `svn delete ${dirPaths.join(' ')}`
  const deleteLabel = 'svn delete ...'
  const spiner = ora(deleteLabel).start()

  const removeCallBack = (deleteData) => {
    deleteData && console.log(deleteData)
    excuteSvnCommand(`svn commit -m "${desc}-delete" ${dest}`, null, () => {
      spiner.stop()
      callback && callback()
    })
  }
  if (dirPaths.length) {
    excuteSvnCommand(deleteConmmand, null, removeCallBack)
  } else {
    removeCallBack()
  }
}

/**
 * 执行svn命令
 *
 * @param {String} command svn命令
 * @param {String} spinerLabel spiner显示的标签
 * @param {Function} callback 执行完后的回调
 */
function excuteSvnCommand(command, spinerLabel, callback) {
  const spiner = spinerLabel ? ora(spinerLabel).start() : null
  cmd.get(command, (err, data, stderr) => {
    spiner && spiner.stop()
    if (err) {
      throw err
    }
    console.log() // 控制台打印空行
    callback(data, stderr)
  })
}

/**
 * 发布
 *
 * @param {String} src 源文件夹
 * @param {String} dest 目标文件夹（svn目录）
 * @param {String} desc 本次提交的描述
 * @param {Function} afterCopy 从原文件夹拷贝代码到目标文件夹之后的回调函数
 * @param {Function} callback 发布完成之后的回调函数
 */
function publish(src, dest, desc, afterCopy, callback) {
  const updatCommand = `svn update ${dest}`
  const updateLabel = 'svn updating...'
  excuteSvnCommand(updatCommand, updateLabel, (updateData) => {
    console.log(updateData)
    removeSvnDir(dest, desc, () => {
      const spiner = ora('copy code now, this may take several minutes').start()
      CopyDirectory(src, dest, afterCopy)
      spiner.stop()
      const addCommond = `svn add ${dest}/* --force`
      const addLabel = 'svn add... '
      excuteSvnCommand(addCommond, addLabel, (addData) => {
        console.log(addData)
        const commitCommand = `svn commit -m "${desc}" ${dest}`
        const commitLabel = 'commit code to svn...'
        excuteSvnCommand(commitCommand, commitLabel, (commitData) => {
          console.log(commitData)
          callback && callback()
        })
      })
    })

  })
}

/**
 * 验证参数合法性
 *
 * @param {String} src 源文件夹
 * @param {String} dest 目标文件夹
 */
function validateParams(src, dest) {
  if (!src || !dest) {
    console.log('src=' + src)
    console.log('dest=' + dest)
    throw new Error('svnCommitter -- invalid parameter！')
  }

  try {
    const srcStats = fs.statSync(src)
    const destStats = fs.statSync(dest)
  } catch (e) {
    throw e
  }
}

// 命令行传入的源文件夹地址与目标文件夹地址
const src = process.argv[2]
const dest = process.argv[3]
const project = process.argv[4]

// validateParams(src, dest)

const afterCopy = (project) => {
  switch (project) {
    case 'zhongshan':
      console.log('00000000000000000000000000000000000')
      fs.copyFileSync('E:/jsproject/chinadci/tanxin-test2/777.text', 'E:/jsproject/chinadci/tanxin-test/static/config')
      break
    default:
      break
  }
}

/*
inquirer.prompt([
  {
    name: 'desc',
    type: 'String',
    message: '请输入你此次发布的描述：（不少于5个字）',
    validate(val) {
      return val.length >= 5
    }
  }
]).then(answers => {
  publish(src,
    dest,
    answers.desc,
    () => {
      afterCopy(project)
    },
    () => {
      console.log('发布成功-' + new Date().toLocaleString())
    }
  )
})

*/


fs.copyFileSync('E:/jsproject/chinadci/zhongshan-zrzy/zsonemap-publish/Global.js', 'E:/jsproject/chinadci/zhongshan-zrzy/zsonemap-publish/dist/static/config/Global.js')