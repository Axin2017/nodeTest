const koa=require('koa');
const session = require('koa-session');
const app=new koa();
const router=require('koa-router')();//注意这里是调用之后马上执行
const bodyParser = require('koa-bodyparser');
const http = require('http')

const httpRequest = (ctx) => {
    return new Promise((resolve) => {
        delete ctx.request.header.host;
        const options = {
            host:'localhost',
            port:'80',
            path: '/jsTest',
            method: ctx.request.method,
            headers: ctx.request.header
        }
        let requestBody='',
            body,
            head,
            chunks = [],
            fileFields,
            files,
            boundaryKey,
            boundary,
            endData,
            filesLength,
            totallength = 0;

        if (ctx.request.body) {
            console.log(ctx.request.header['content-type'])
            if(ctx.request.header['content-type']){
                if (ctx.request.header['content-type'].indexOf('application/x-www-form-urlencoded') > -1) {
                    requestBody = query.stringify(ctx.request.body);
                    options.headers['Content-Length'] = Buffer.byteLength(requestBody)
                } else if (ctx.request.header['content-type'].indexOf('application/json') > -1) {
                    requestBody = JSON.stringify(ctx.request.body);
                    options.headers['Content-Length'] = Buffer.byteLength(requestBody)
                } else if (ctx.request.header['content-type'].indexOf('multipart/form-data') > -1) {
                    fileFields = ctx.request.body.fields;
                    files = ctx.request.body.files;
                    boundaryKey = Math.random().toString(16);
                    boundary = `\r\n----${boundaryKey}\r\n`;
                    endData = `\r\n----${boundaryKey}--`;
                    filesLength = 0;
    
                    Object.keys(fileFields).forEach((key) => {
                        requestBody +=  `${boundary}Content-Disposition:form-data;name="${key}"\r\n\r\n${fileFields[key]}`;
                    })
    
                    Object.keys(files).forEach((key) => {
                        requestBody += `${boundary}Content-Type: application/octet-stream\r\nContent-Disposition: form-data; name="${key}";filename="${files[key].name}"\r\nContent-Transfer-Encoding: binary\r\n\r\n`;
                        filesLength += Buffer.byteLength(requestBody,'utf-8') + files[key].size;
                    })
    
                    options.headers['Content-Type'] = `multipart/form-data; boundary=--${boundaryKey}`;
                    options.headers[`Content-Length`] = filesLength + Buffer.byteLength(endData);
                }
            } else {
                requestBody = JSON.stringify(ctx.request.body)
                options.headers['Content-Length'] = Buffer.byteLength(requestBody)
            }
        }

        
        

        const req = http.request(options, (res) => {
            res.on('data', (chunk) => {
                chunks.push(chunk);
                totallength += chunk.length;
            })

            res.on('end', () => {
                body = Buffer.concat(chunks, totallength);
                head = res.headers;
                resolve({head, body});
            })
        })
        //ctx.request.body && req.write(requestBody);

        if (fileFields) {
            let filesArr = Object.keys(files);
            let uploadConnt = 0;
            filesArr.forEach((key) => {
                let fileStream = fs.createReadStream(files[key].path);
                fileStream.on('end', () => {
                    fs.unlink(files[key].path);
                    uploadConnt++;
                    if (uploadConnt == filesArr.length) {
                        req.end(endData)
                    }
                })
                fileStream.pipe(req, {end: false})
            })
        } else {
            req.end();
        }

    })
}

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));

//get请求
router.get('/*',async ctx=>{
    const res = await httpRequest(ctx);
    ctx.response.type=res.head['content-type'];
    ctx.response.header = res.head
    ctx.response.body = res.body
});
//调用方式 http://localhost:8081/index/axin
// router.get('/index/:name',(ctx)=>{
//     let name=ctx.params.name;
//     ctx.response.type='text/html';
//     ctx.response.body= `hello ${name}`;
// });
// router.get('/postTest',(ctx)=>{
//     ctx.response.body=`
//         <form action="postResult" method="post">
//             name:<input type="text" name="name" />
//             age:<input type="text" name="age" />
//             <input type="submit" value="submit" />
//         </form>
//     `;
// });

//nodejs 自带的request不提供对post数据的解析。只能通过接受流然后转换成字符串。这里引入koa-bodyparser 来处理post数据

//post请求的写法
// router.post('/postResult',(ctx)=>{
//     let name=ctx.request.body.name || '';
//     let age=ctx.request.body.age || '';
//     ctx.response.body= `welcome ! ${age} year old ${name}`;
// });

//在router之前加上
app.use(bodyParser());

app.use(router.routes());

app.listen(8081);
console.log('app started at port 8081...');