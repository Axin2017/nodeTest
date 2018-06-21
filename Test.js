var Person=require('./MyModule');
let  xiaoming=new Person('xiaoming',16);
xiaoming.hello();
let count=1;
let countMount=()=>{
    count=count+1;
    console.log(count);
    if(count<100){
        process.nextTick(countMount);
    }
}
countMount();
process.nextTick(()=>{console.log('end');})