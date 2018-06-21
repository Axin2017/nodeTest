let express=require('express');
let app=express();
app.get('/*', function (req, res) {
    res.send('Hello World');
  });
  
  // 定义好我们 app 的行为之后，让它监听本地的 3000 端口。这里的第二个函数是个回调函数，会在 listen 动作成功后执行，我们这里执行了一个命令行输出操作，告诉我们监听动作已完成。
  app.listen(3000, function () {
    console.log('app is listening at port 3000');
  });