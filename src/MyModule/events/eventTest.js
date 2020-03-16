// 引入 events 模块
const events = require('events');
// 创建 eventEmitter 对象
const eventEmitter = new events.EventEmitter();
const fs=require("fs");

// 创建事件处理程序
var connectHandler = function connected() {
    console.log('连接成功。');
    let data=fs.readFileSync('MyModule/stream/output.txt','utf8');
    console.log(data);
    process.nextTick(()=>{eventEmitter.emit('data_received');});
}

// 绑定 connection 事件处理程序
eventEmitter.on('connection', connectHandler);

// 使用匿名函数绑定 data_received 事件
eventEmitter.on('data_received', function () {
    console.log('数据接收成功。');
});

// 触发 connection 事件 
//经过测试，事件触发是同步的，非异步。
eventEmitter.emit('connection');

console.log("程序执行完毕。");