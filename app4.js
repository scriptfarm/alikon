'use strict';
const koa=require('koa');
//const http=require('http');
//const https=require('https');
const co=require('co');
const render=require('./libs/render.js');
const path=require('path');
const url=require('url');
const Pool=require('pg-pool');
const serve=require('koa-static');
//var flash=require('koa-flash');
//r PS=require('pg-pubsub');
//var favicon=require('koa-favicon');
var PS=require('./libs/pg-subpub.js');
var bodyParser=require('koa-body');
var session=require('koa-generic-session');
//var PgStore=require('koa-pg-session');
var PgStore=require('./pg-sess.js');
const passport=require('koa-passport');
const fs=require('co-fs');
const fss=require('fs');
const PgBoss=require('pg-boss');
const pubrouter=require('./routes/pubrouter2.js');
const adminrouter=require('./routes/admin.js');
const configDB=require('./config/database.js');
const {msg_handler} = require('./libs/mailer.js');
var {script}=require('./libs/filter_script');
/*

var locals={
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');
	return mn;}catch(e){console.log(e);return e;}},
* show_banners(){try{let m=yield this.db.query('select*from banners');return m.rows;}catch(e){console.log(e);return e;}}
};
*/
//var database_url=configDB.pg_local_heroku_url; //for a "production" deploying to heroku.com
var database_url=configDB.pg_url;// for home development
//var database_url='postgres://globik:null@localhost:5432/postgres';
var dop_ssl='';
if(process.env.DEVELOPMENT ==="yes"){
	//dop_ssl="?ssl=true";
	dop_ssl="";
}else{dop_ssl="?ssl=true"}
var boss=new PgBoss(database_url+dop_ssl);

console.log('database_url: ',database_url);
console.log('process.env.DEVELOPMENT and DEV_USER: ',/*process.env.DEVELOPMENT,*/process.env.DEV_PWD);
var pars=url.parse(database_url);
var cauth=pars.auth.split(':');
console.log('user auth[0] ', cauth[0]);
console.log('pwd auth[1] ', cauth[1]);
console.log('host: ',pars.hostname);
console.log('port: ',pars.port);
console.log('db name: ',pars.pathname.split('/')[1]);
var pconfig={
user:cauth[0],
password:cauth[1],
host:pars.hostname,
port:pars.port,
database: pars.pathname.split('/')[1],
ssl: false};//local_host=false heroku=true

var app=koa();
var pool=module.exports=new Pool(pconfig);

require('./config/passport2.js')(pool, passport);

var pg_store=new PgStore(pool);
//var pg_store=new PgStore(database_url);

var locals={
* showmodule(){try{var mn=yield fs.readFile('app.json','utf-8');
	return mn;}catch(e){console.log(e);return e;}},
* show_banners(){try{let m=yield pool.query('select*from banners');return m.rows;}catch(e){console.log(e);return e;}}
};

render(app,{})
app.use(serve(__dirname+'/public'));
//app.use(favicon());



app.keys=['fg'];
app.use(session({store:pg_store}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(flash());
var lasha=true;
app.use(bodyParser());

app.use(function*(next){
if(this.method ==='POST'){
//this.flash={error:'flash err'};
}else if(this.method==='GET'){
//this.flash.woane=this.path;
	//this.session.dorthin=this.path;
	console.log('this.session.dorthin: ',this.session.dorthin);
}
yield next;});
var mobject={};
app.use(function*(next){
this.state.filter_script=script;
	this.db=pool;
	this.boss=boss;
var sa;
if(lasha){sa=yield locals.showmodule();
sa=JSON.parse(sa);
mobject.showmodule=sa;
lasha=false;
}

this.state.showmodule=mobject.showmodule;
this.state.showmodulecache=lasha;
this.state.banner=yield locals.show_banners();
if(this.path=='/module_cache'){
lasha=true;}
yield next;
});
app.use(pubrouter.routes())

//  \i /home/globik/alikon/sql/del.sql
app.use(adminrouter.routes());

app.use(function*(next){
	try{
		
		yield next;
	console.log('THIS.STATUS!!!!: ', this.status);
		if(this.status === 404) this.throw(404,"fuck not found",{user:"fuck userss"});
	}catch(err){
	this.status=err.status || 500;
		console.log('THIS>STATUS: ',this.status);
		if(this.status=== 404){
			this.session.error='';
			this.redirect('/error');}
			//this.body=this.render('error',{message:err.message, error:err.status});
	}

});

app.on('error',(err, ctx)=>{
console.log('app.on.error: ',err.message, ctx.request.url);
});

pg_store.on('connect',()=>console.log('PG_STORE IS CONNECTED!!!'));

//var ssl_options={key:fss.readFileSync('server.key'),cert:fss.readFileSync('server.crt')};

pg_store.setup().then(()=>{
	console.log('soll listnening port 5000 via setup()');
app.listen(process.env.PORT || 5000)
	/*
	https.createServer(ssl_options,app.callback()).listen(process.env.PORT || 5000, (err) => {
    //if (err) { throw new Error(err);}

    console.log('Listening on https//localhost: 5000');
  });
	*/
	
});
console.log('soll on 5000');

pool.on('connect', client=>console.log('pool connected'));
pool.on('error', (err, client)=>console.log('error in pool: ', err.message));
pool.on('acquire', client=>console.log('pool acquired '));
/*var dop_ssl='';
if(process.env.DEVELOPMENT ==="yes"){
	//dop_ssl="?ssl=true";
	dop_ssl="";
}else{dop_ssl="?ssl=true"}
*/
var ps=new PS(database_url+dop_ssl);

ps.addChannel('validate', msg_handler);
ps.addChannel('reset', msg_handler);

ps.addChannel('events_bitpay', bp_msg=>{
	console.log('bpmsg: ', bp_msg);
	console.log('status: ',bp_msg.data.infbp.status);
//var mail=JSON.parse(bp_msg.data.infbp.buyerFields).buyerEmail;
var mail=bp_msg.data.infbp.buyerFields.buyerEmail;
	console.log('mail: ',bp_msg.data.infbp.buyerFields.buyerEmail);
var items=JSON.parse(bp_msg.data.infbp.posData).items;
if(bp_msg.data.infbp.status==="paid"){
co(function*(){
try{
//console.log('Durak: ',JSON.parse(bp_msg.data.infbp.buyerFields).buyerEmail);
	//console.log('email: ',bp_msg.data.infbp.buyerFields.buyerEamil);
//console.log('items: ',JSON.parse(bp_msg.data.infbp.posData).items);
yield pool.query(`update busers set w_items=${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status paid: ', e);}
})
}else if(bp_msg.data.infbp.status==="complete"){
co(function*(){
try{
yield pool.query(`update busers set items=items+${items}, w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in evs bitpay status complete: ', e);}
})
}else if(bp_msg.data.infbp.status==="invalid"){
co(function*(){
try{
yield pool.query(`update busers set w_items=w_items-${items} where email='${mail}'`);
}catch(e){console.log('err in ev bitpay status invalid: ',e);}
})
}else{}
})
//--trace-warnings

boss.start().then(ready).catch(err=>console.log(err));

function ready(){
	
boss.subscribe('banner_enable', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`insert into ban_act(ban_id,href,src,title,type) values('${job.data.ban_id}',
'${job.data.href}','${job.data.src}','${job.data.title}','${job.data.type}')`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})

boss.subscribe('banner_disable', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`delete from ban_act where ban_id='${job.data.ban_id}'`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})
//dummy bitpay webhooks
boss.subscribe('bitpay_paid', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`insert into bitpayers(infbp) values('${JSON.stringify(job.data.message)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${job.data.message.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})

boss.subscribe('bitpay_complete', (job,done)=>{
console.log(job.name,job.id,job.data);
co(function*(){
try{
yield pool.query(`insert into bitpayers(infbp) values('${JSON.stringify(job.data.message)}') 
on conflict((infbp->>'id'::text)) do update set infbp=jsonb_set(bitpayers.infbp,'{status}','"${job.data.message.status}"') 
where bitpayers.infbp->>'status' not like '%complete%'`);
}catch(e){console.log(e)}
})
done().then(()=>console.log('confirmed done'))
})



}	

process.on('unhundledRejection',(reason, p)=>{
	console.log('Unhandled Rejection at: Promise', p, 'reason: ', reason);
});
		