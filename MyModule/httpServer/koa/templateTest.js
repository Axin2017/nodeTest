const env=require('../../templateRender/nunjucksModel');
const template=env.render('templateTest.html',{name:'谭新'});
console.log(template);