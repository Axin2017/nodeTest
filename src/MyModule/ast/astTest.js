const babelParser = require('@babel/parser')
const testModule = require('./astTestModule')
const babel = require('@babel/core')
const path = require('path')

const code=`
  function a(){
    // aaa
    return 11
  }
`

const ast = babelParser.parse(code)

console.log(ast)