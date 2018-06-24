const http=require('http');
const url=require('url');
let handle=(req,res)=>{
    if(req.method=='GET'){
        handle_get(req,res);
    }else{
        handle_post(req,res);
    }
}
let handle_get=(req,res)=>{
    let urlObj=url.parse(req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});  
    res.end(JSON.stringify(urlObj));
}
let handle_post=(req,res)=>{
    let urlObj=url.parse(req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});  
    res.end(JSON.stringify(urlObj));
}
const server=http.createServer(handle);
server.listen(8081);
console.log('start listen 8081');