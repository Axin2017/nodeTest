const path = require('path')
const cwd = require('process').cwd()


const p = path.resolve(process.cwd(),'svncommitter.config.js')
const a = require(p)
console.log(a)