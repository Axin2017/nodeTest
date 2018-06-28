const koa=require('koa');
const app=new koa();
const router=require('koa-router')();//注意这里是调用之后马上执行
const bodyParser = require('koa-bodyparser');
//get请求
router.get('/',(ctx,next)=>{
    ctx.response.type='text/html';
    ctx.response.body='this is indexPage';
});
//调用方式 http://localhost:8081/index/axin
router.get('/index/:name',(ctx)=>{
    let name=ctx.params.name;
    ctx.response.type='text/html';
    ctx.response.body= `hello ${name}`;
});
router.get('/postTest',(ctx)=>{
    ctx.response.body=`
        <form action="postResult" method="post">
            name:<input type="text" name="name" />
            age:<input type="text" name="age" />
            <input type="submit" value="submit" />
        </form>
    `;
});

//nodejs 自带的request不提供对post数据的解析。只能通过接受流然后转换成字符串。这里引入koa-bodyparser 来处理post数据

//post请求的写法
router.post('/postResult',(ctx)=>{
    let name=ctx.request.body.name || '';
    let age=ctx.request.body.age || '';
    ctx.response.body= `welcome ! ${age} year old ${name}`;
});

//在router之前加上
app.use(bodyParser());

app.use(router.routes());

app.listen(8081);
console.log('app started at port 8081...');