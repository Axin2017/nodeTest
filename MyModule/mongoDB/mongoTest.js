const mongoDB=require('mongodb');
const mongoClient=mongoDB.MongoClient;
const url="mongodb://localhost:27017";
const  log=data=>{
    if(typeof data !='string'){
        console.log(JSON.stringify(data));
    }
}
mongoClient.connect(url,{ useNewUrlParser: true },(error,db)=>{
    if(error){
        throw error;
    }
    console.log('连接成功');
    const txTest=db.db('txTest');
    //创建集合
    //txTest.createCollection()
    log(txTest.collections);
    txTest.collection('user').find().toArray((err,res)=>{
        if(err){
            throw err;
        }
        console.log(JSON.stringify(res));
    });
    db.close();
});