const http=require('http');
const url=require('url');
const querystring = require('querystring');
let handle=(req,res)=>{
    if(req.method=='GET'){
        handle_get(req,res);
    }else{
        handle_post(req,res);
    }
}
let handle_get=(req,res)=>{
    let urlObj=url.parse(req.url);
    res.writeHead(200, {'Content-Type': 'text/html'});  
    res.end(JSON.stringify(urlObj));
}
let handle_post=(req,res)=>{
    let postBody='';
    req.on('readable',()=>{
        let d=req.read();
        if (typeof d == 'string') {
            postBody += d;
        }else if(typeof d =='object' && d instanceof Buffer){
            postBody+=d.toString('utf8');
        }
    });
    req.on('end',()=>{
        if(postBody){
            try{
                let posBodyOj=JSON.parse(postBody);
                res.writeHead('200',{"Content-Type":"text/html"})
                res.end(JSON.stringify(posBodyOj));
            }catch(e){
                res.writeHead('500',{"Content-Type":"text/html"})
                res.end(JSON.stringify({"error":"error"}));
            }
        }
    });
}
const server=http.createServer(handle);
server.listen(8081);
console.log('start listen 8081');