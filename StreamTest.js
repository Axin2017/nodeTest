/*
 * name:
 * author:
 * description:
 * createTime:
 */
var fs=require('fs');
var writeStream=fs.createWriteStream('output.txt');
writeStream.write('this is my test file');
writeStream.end();
writeStream.on('finish',function(){
	console.log('输入完毕');
	
});
writeStream.on('error',function(error){
	console.log(error);
});
console.log('输入程序处理完毕');
var readStream=fs.createReadStream('output.txt');
readStream.pipe(process.stdout);