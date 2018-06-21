/*
 * name:
 * author:
 * description:
 * createTime:
 */
function Person(name,age){
	this.name=name;
	this.age=age;
	this.hello=function(){
		console.log(`hello everyone! my name is ${this.name},and my age is ${this.age}`);
	}
}
module.exports=Person;