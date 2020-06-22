

/**
 * 异步函数按顺序执行
 *
 * @param {Array<{func: function, args: Array<any>}>} funcsObjArray 异步函数对象数组
 * @param {object} context 绑定的this变量
 * @returns {Promise} 返回按顺序调用后的结果
 */
async function composeAsync (funcsObjArray, context) {
  const res = []
  for (let i = 0; i < funcsObjArray.length; i++) {
    try {
      const { func, args } = funcsObjArray[i]
      const rs = await func.call(context, ...args)
      console.log(rs)
      res.push(rs)
    } catch (ex) {
      res.push(ex)
    }
  }
  return res;
}

const arr = new Array(4).fill('1')

const promises = arr.map(() => {
  return function(arg){
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(arg)
      }, arg * 1000)
    })
  }
})
const funcs = promises.map(p => {
  return {
    func: p,
    args: [Math.ceil(Math.random() * 5)]
  }
})

composeAsync(funcs).then(res => {
  console.log(res)
})
console.log('开始啦')

