var koa=require('koa');
var app=koa();
var port=process.env.PORT || 3000;

app.use(function*(next){
var start=new Date;
yield next;
var ms=new Date - start;
console.log('%s %s - %s ',this.method,this.url,ms);
});
app.use(function*(){
this.body="Hello World(koa.js)!";
});
app.listen(port);
console.log('Server is running on port ',port);
