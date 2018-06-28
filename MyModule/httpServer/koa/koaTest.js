const koa=require('koa');
const app=new koa();
//app.use 将一个一个地调用注册过的异步函数。awaite next 意思是调用下一个异步函数
//这个非常有用。比方第一个可以做权限控制，第二个可以做日志等。。
//如果某一个函数不再继续awaite next，则后面注册的不会再调用
app.use(async (ctx,next)=>{
    console.log('1 start');
    await next();
    console.log('1 middle');
    ctx.response.type='text/html';
    ctx.response.body='<h1> this is koa test1 </h1>'
    console.log('1 end');
});
app.use(async (ctx,next)=>{
    console.log('2 start');
    await next();
    console.log('2 middle');
    ctx.response.type='text/html';
    ctx.response.body='<h1> this is koa test2 </h1>'
    console.log('2 end');
});
app.use(async (ctx,next)=>{
    console.log('3 start');
    await next();
    console.log('3 middle');
    ctx.response.type='text/html';
    ctx.response.body='<h1> this is koa test3 </h1>'
    console.log('3 end');
});
app.listen(8081);
console.log('app started at port 8081...');