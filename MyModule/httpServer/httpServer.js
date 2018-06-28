const http=require('http');
const url=require('url');
const fs=require('fs');

const htmlBaseDir='./src/html';
const errorHandle=(res,error,statusNum,msg)=>{
    res.writeHead(statusNum,{"Content-Type":"text/html"});
    res.end(msg ||error.message ||'some error happend');
}
const successHandle=(res,data)=>{
    res.writeHead(200,{"Content-Type":"text/html"});
    if(typeof data=='object') {
        data=JSON.stringify(data);
    }
    res.end(data);
}
let getHandle=(req,res)=>{
    const urlObj=url.parse(req.url);
    const path=urlObj.path;
    const relPath=htmlBaseDir+path;
    fs.access(relPath,(error)=>{
        if(error){
            errorHandle(res,error,404);
        }
        fs.createReadStream(relPath).pipe(res);
    });
}
let postHandle=(req,res)=>{

}
let handle=(req,res)=>{
    if(req.method=='GET'){
        getHandle(req,res);
    }else{
        postHandle(req,res);
    }
}
const httpServer=http.createServer(handle);
httpServer.listen(8080);