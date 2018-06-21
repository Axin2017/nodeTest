let http=require('http');
let handle=(req,res)=>{
    console.log('request get');
    res.writeHead(200, {'Content-Type': 'text/plain'});  
    res.end(JSON.stringify({name:"谭新"}));
}
let server=http.createServer(handle);
server.listen(8081);
console.log('start listen 8081');