const fs = require('fs')
const path = require('path')
const cmd = require('node-cmd')
const ora = require('ora')
const inquirer = require('inquirer')
const http = require('http')

var request = require("request")
for (let i = 1; i < 78; i++) {
  const src = `https://book.yunzhan365.com/mlpe/smrl/files/mobile/${i}.jpg?x-oss-process=image/format,png`
  const writeStream = fs.createWriteStream(`D:\\语文一年级下册\\第${i}页.png`)
  const readStream = request(src)
  readStream.pipe(writeStream)
  readStream.on('end', function () {
    console.log(`第${i}页下载成功`)
  })
  readStream.on('error', function () {
    console.log(`第${i}页错误信息:` + err)
  })
  writeStream.on("finish", function () {
    console.log(`第${i}页写入成功`);
    writeStream.end();
  })
}

