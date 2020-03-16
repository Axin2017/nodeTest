const mongoDB=require('mongodb');
const mongoClient=mongoDB.MongoClient;
const url="mongodb://localhost:27017";
const _consoleLog=data=>{
    if(data && typeof data=='object'){
        console.log(JSON.stringify(data));
    }else{
        console.log(data);
    }
}
let db=null;
mongoClient.connect(url,{ useNewUrlParser: true },(error,db)=>{
    if(error){
        throw error;
    }
    console.log('连接成功');
    const txTest=db.db('txTest');
    //创建集合
    txTest.createCollection('family',(error,col)=>{
        if(error)  throw error;
        console.log(`create collection ${col.collectionName} success!`);
    });
    //插入数据
    txTest.collection('family').insertOne({'wife':'mzf'},(error,result)=>{
        if(error){
            throw error;
        }else{
            _consoleLog(result);
        }
    })
    //查找数据
    txTest.collection('user').find().toArray((err,res)=>{
        if(err){
            throw err;
        }
        _consoleLog(res);
    });
    //更新数据.如果更新的属性不存在，则会给查询到的数据添加该属性
    txTest.collection('user').updateOne({ name: "axin" }, {$set:{ password: "1",role:"admin" }}).then(
        res => {
            txTest.collection('user').find().toArray().then(
                res => { _consoleLog(res) }
            );
        },
        error => { throw error }
    );
    //db.close();
});