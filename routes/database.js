var passport=require('koa-passport');
var Router=require('koa-router');
var bodyParser=require('koa-body');
var wrap=require('co-monk');
var moment=require('moment');//2.10.0
var fs=require('co-fs');
// var sendgrid=require('sendgrid')('sendgrid44248@modulus.io','u1vin9v9');
var reqw=require('koa-request');
var fuckall=new Router();

fuckall.post('/custom2', function*(next) {
var ctx = this;
yield* passport.authenticate('local',function*(err, user,info) {
if (err) throw err;
if (user === false) {
 ctx.status =401;
 ctx.body = { success: false,info:[info.message] }
 } 
else {
  yield ctx.login(user); 
  //iojs index
  console.log('Where are you from :'+ctx.session.dorthin);
  console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
  ctx.body={success:true,redirect:ctx.session.dorthin || '/'};
  //ctx.redirect(ctx.session.dorthin || '/app');
    }
  }).call(this, next)
});
fuckall.get('/login',function *(){
	yield this.render('login',{user:this.req.user,info:"OK"});
})
fuckall.post('/login',
  passport.authenticate('local', {
    successRedirect: '/app',
    failureRedirect: '/'
  }));

fuckall.post('/signup',
passport.authenticate('local-signup',
{successRedirect:'/',
 failureRedirect:'/',
failureFlash:true}));

fuckall.get('/logout', function*(next) {
this.logout();
  this.redirect('/');
});
//function ab(x = 2,y){console.log(x,y)} ab(2)
fuckall.get('/auth/facebook',passport.authenticate('facebook'));
//{ scope: ['user_status', 'user_checkins'] }
fuckall.get('/auth/facebook/callback',passport.authenticate('facebook',{successRedirect:'/labo',
failureRedirect:'/'}))


fuckall.post('/addingfuckinguser2',bodyParser({multipart:true,formidable:{}}),
function *(next){
	var db=this.fuck;
	var username=this.request.body.fields.username;
	var email=this.request.body.fields.email;
	var password=this.request.body.fields.password;
	this.body=JSON.stringify(this.request.body,null,2);
	var dbus=wrap(db.get('users'));
	try{
	var users=yield dbus.findOne({email:email});
	console.log(users.email);
	this.status=401;
	this.body={success:false,info:"user exists"}
	}catch(err){
		//this.login('user')
 this.body = { success: true,info:'success!!!!' }
		console.log(err);
	
	//node index
	/***
	yield users.insert({username:username,
	                    email:email,
						password:password,
						role: "simple"});
	//console.log('in :'+this.request.body.fields.username);
	***/
	}
yield next;});
//node index

fuckall.post('/addingfuckinguser', function*(next) {
var ctx = this;
yield* passport.authenticate('local-signup',function*(err, user,info) {
if (err) throw err;

if (user == false) {
	//if(info.message == false){
 ctx.status =401;
 console.log('un user',user);
 ctx.body = { success: true,info:[info.message], infod:"Es gibt schon einer"}
 } 
 else{
//if(info.message == true){
	console.log('user in database',user)
	//ctx.status=401;
  yield ctx.login(user);
//here is false  
  //iojs index
  //console.log('Where are you from :'+ctx.session.dorthin);
  //console.log("You are from the this.flash.woane direction in custom :"+ctx.flash.woane);
  ctx.body={success:"ok",info:[info.message],infod:'Noch nicht gibt es. OK.',redirect:'/insert2',user:user};
  //ctx.redirect(ctx.session.dorthin || '/app');
   }
  }).call(this, next)
});
//node index
fuckall.get('/', function *(){
var user=this.req.user;
this.session.dorthin=this.path;
var b=yield fs.readFile('view/config.json','utf-8');
		console.log('file content: '+b);
		var site_name="Attariku";
		var title="Atariku";
		var type="website";
		var image=`http://${this.host}/images/kuku.png`;
		var description="Atariku is your best choice forever!";
		
		var url=`http://${this.host}${this.path}`;
		var locvar={site_name,title,type,image,description,url};
		
		var card="summary";
	    var creator="@GlobiGoos";
		var site="@GlobiGoos";
		var twitter_locvar={card,site,creator,url,title,description,image}
yield this.render('content',{user,file:b,locvar,twitter_locvar});});

fuckall.get('/articles',function *(){
var db=this.fuck;
this.session.dorthin=this.path;
var doc=wrap(db.get('posts'));
try{
var totalposts=yield doc.count({});

	console.log('TOTAL POSTS :',totalposts);
	var perPage=4;
var posts=yield doc.find({},{limit:4,skip:0,sort:{_id:-1}});
console.log('count',posts.length);

var bube=posts.map(function(ob){return moment(ob.created).format('MMM D');});
var formated=posts.map(function(ob){return moment(ob.created).format('YYYY[-]MM[-]DD[-]');});
       var site_name="Atariku";
	   var title="Photoblog - Atariku";
		var type="website";
		var image=`http://${this.host}/images/kuku.png`;
		var description="Photoblog about something";
		
		var url=`http://${this.host}${this.path}`;
		var article_section="";
		var article_author="";
		var article_modified="";
		var article_publisher="";
		var article_tag="";
		var article_published_time="";
		var locvar={site_name,title,type,image,description,
		url/*,article_section,article_author,article_modified,article_publisher,article_tag,
		article_published_time*/};
	var card="summary";
	    var creator="@GlobiGoos";
		var site="@GlobiGoos";
		var twitter_locvar={card,site,creator,url,title,description,image}
yield this.render('insert2',{user:this.req.user,posts,formated:formated,bube:bube,
pages_count:Math.floor(totalposts/perPage),current_page:0,locvar,twitter_locvar});
}catch(err){yield this.redirect('error-view',{user:this.req.user,err:err});}

});
fuckall.param('skip',function *(skip,next){
	if(isNumber(this.params.skip) == false){ 
	this.flash={fucker:"Not a number type"};
	this.redirect('/error-view');}
	
	function isNumber(str){
		var numstr=/^\d+$/;
		return numstr.test(str);
	}
	var doc=wrap(db.get('posts'));
	try{
var db=this.fuck;
		
	var perPage=4;
	var page=Math.max(0,parseInt(this.params.skip));
	//var page=parseInt(this.params.skip);
	var totalposts=yield doc.count({});
	console.log('TOTAL POSTS :',totalposts);
		var posts=yield doc.find({},{limit:4,skip:perPage*page,sort:{_id:-1}});
		if(!posts)console.log('scheisse');
		var bube=posts.map(function(ob){return moment(ob.created).format('MMM D');});
var formated=posts.map(function(ob){return moment(ob.created).format('YYYY[/]MM[/]DD[/]');});

console.log('Formated into Data: ',formated[0]);
console.log('Post created : ',posts[0].created);
this.posts=posts;
this.formated=formated;
this.bube=bube;
this.pages_count=Math.floor(totalposts/perPage);
this.current_page=page;
	yield next;}
	catch(err){console.log("fUCK ERROR by skiping articles");
	this.flash={fucker:err.toString()};
	this.redirect('/error-view')}
}).get('/articles/:skip',function *(){
	this.session.dorthin=this.path;
	var site_name="Atariku";
	var title="Atariku";
		var type="website";
		var image=`http://${this.host}/images/kuku.png`;
		var description="Skip articles in  a blog";
		var url=`http://${this.host}${this.path}`;
		var article_section="";
		var article_author="";
		var article_modified="";
		var article_publisher="";
		var article_tag="";
		var article_published_time="";
		var locvar={site_name,title,type,image,description,
		url/*,article_section,article_author,article_modified,article_publisher,article_tag,
		article_published_time*/};
	var card="summary";
	    var creator="@GlobiGoos";
		var site="@GlobiGoos";
		var twitter_locvar={card,site,creator,url,title,description,image}
	yield this.render('skip',{user:this.req.user,posts:this.posts,formated:this.formated,bube:this.bube,
pages_count:this.pages_count,current_page:this.current_page,locvar,twitter_locvar});

});

fuckall.get('/articles/:id/:title',function *(next){
/*if(isNumber(this.params.id) == false){ 
	this.flash={fucker:"Not a number type"};
	this.redirect('/error-view');}*/
	
	
	console.log("Params id :",this.params.id);
	var suka=this.params.id;
	//this.params.year+'/'+this.params.month+'/'+this.params.day;
	console.log("Suka :",suka);
	//console.log("THIS STATUS in articles params",this.status)
	if(!suka){this.redirect('/error-view');}
	var db=this.fuck;
 var doc=wrap(db.get('posts'));
 try{
 var post= yield doc.findOne({'_id':this.params.id,'title':this.params.title});
 console.log('post :',post.postname);
var date=moment(post.created);
var redact=moment(post.redaktiert);
var formated=date.format('MMM D YYYY');
var redformat=redact.format('MMM D YYYY');
console.log('Dataformat :',post.dataformat);
this.session.dorthin=this.path;
var site_name="Atariku";
var title=post.postname;
		var type="website";
		var image;
		if(!post.hasOwnProperty("images")){image=`http://${this.host}/images/kuku.png`}else{
		if (post.images[0].hasOwnProperty("src1")){image=`http://${this.host}${post.images[0].src2}`;}
		else{image=`http://${this.host}${post.images[0].src}`;}
		}
		var description=post.shorti;
		var url=`http://${this.host}${this.path}`;
		var article_section=post.rubrik;
		var article_author=post.autor;
		var article_modified=post.redaktiert;
		var article_publisher="https://facebook.com/globigoose";
		var article_tag=post.meta;
		var article_published_time=post.created;
		var locvar={site_name,title,type,image,description,
		url/*,article_section,article_author,article_modified,article_publisher,article_tag,
		article_published_time*/};
	var card="summary";
	    var creator="@GlobiGoos";
		var site="@GlobiGoos";
		var twitter_locvar={card,site,creator,url,title,description,image}
yield this.render('formated-article-view',{user:this.req.user,post:post,
formated:formated,redformat:redformat,locvar,twitter_locvar});

try{
yield doc.updateById(this.params.id,{/*$set:{fb_data:fb_data},*/$inc:{gesamt_seen:1}});
}catch(er){console.log('Er in fotoblog article',er)}

 }
catch(err){
 this.status=404;
 this.flash={fucker:err.toString()};
 this.redirect('/error-view');
 }
});
fuckall.get('/error-view',function *(){
	yield this.render('error-view',{err:this.message,status:this.status,
	user:this.req.user,fly:this.flash.fucker,og_plugin:false,schema_plugin:false})
})

fuckall.get('/labo',function *(){
	var wrap=this.wrap;
	var posts=wrap("codeblogs");
	var post=yield posts.find();
	this.session.dorthin=this.path;
	var site_name="Atariku"
	var title="Labo";
		var type="website";
		var image=`http://${this.host}/images/kuku.png`;
		var description="creative javascript code";
		var url=`http://${this.host}${this.path}`;
		/*var article_section="";
		var article_author="";
		var article_modified="";
		var article_publisher="";
		var article_tag="";
		var article_published_time="";
		*/
		var locvar={site_name,title,type,image,description,url};
		var card="summary";
	    var creator="@GlobiGoos";
		var site="@GlobiGoos";
		var twitter_locvar={card,site,creator,url,title,description,image};
	yield this.render('labo',{user:this.req.user,post,locvar,twitter_locvar})	
});
var tr=0;
fuckall.get("/labo/:id/:title",function *(id){
var db=this.fuck;
var fb_data;

var burl;

var posts=wrap(db.get('codeblogs'));
 var session = this.session;
  session.count = session.count || 0;
  session.count++;
  //console.log(this.header)
 //session.mount=session.mount || [];
 //session.mount.push({artpath:this.path,views:session.count})
try{
var post=yield posts.findById(this.params.id);
//console.log('post :',post)

        var site_name="Atariku";
        var title=post.title;
		var type="article";
		var image="http://alikon.herokuapp.com/images/kuku.png";
		var description=post.teaser;
		var rich_attachment=true;
		var url=`http://${this.host}${this.path}`;
		console.log("URL :",this.host)
		var section=post.rubrika;
		var author="https://www.facebook.com/alik.ivanov1";//post.autor;
		var date=moment(post.created_on);
		//var modified=date.format('YYYY-MM-DD');
		//post.created_on;
		var publisher="https://www.facebook.com/globigoose";
		//var article_tag=post.tags;
		var published_time=date.format('YYYY-MM-DD');//  post.created_on;
		var locvar={site_name,title,type,image,description,url,rich_attachment}
		var work_article={section,author/*,modified*/,publisher,/*article_tag,*/published_time};
		
		var card="summary";
	    var creator="@GlobiGoos";
		var site="@GlobiGoos";
		var twitter_locvar={card,site,creator,url,title,description,image}

		yield this.render('code_blog_an_article_view',{user:this.req.user,post:post,locvar,work_article,
		twitter_locvar,fb_data});
//console.log('HEADER :',this.header)//referer,cookie
/*
if(this.host=="localhost:3000"){
burl="http://127.0.0.1:3000/fake-fb-data.json";
}else{
burl=`http://graph.facebook.com/?id=${this.protocol}://${this.host}${this.path}`;
*//*
var gugfb=`http://graph.facebook.com/fql?q=SELECT%20like_count%20FROM%20link_stat%20WHERE%20url%20=%20%22${this.protocol}://${this.host}${this.path}%22`;
*/
//}


	/*try{
		
var options = {url:burl, headers: { 'User-Agent': 'request' }};	
var tinfo=yield reqw(options);

fb_data=JSON.parse(tinfo.body);
*/
var unic_per_ses;
//superunic_per_ses;
var getSid= s =>{'use strict';let si=s.includes('koa.sid='), b;
if(si){s.replace(/(koa.sid)=([\w-_]+);/g,(s,of1,of2,sd) => b=of2);}return b;}
var we=this.get('cookie');
if(we){
    var sidd=getSid(we);
	var bu_ses=`koa:sess:${sidd}`;
	var dbses=wrap(db.get('sessions'));
	var metrics={};
	//metrics.page=this.path;
	//metric.views=
	try{
		var dfses=yield dbses.findOne({sid:bu_ses});
	//console.log('dfses :',dfses);
	console.log(`I'v Found this session sid ${dfses.sid}`);
	//node index
	//yield dbses.updateById(dfses._id,{$inc:{ges_seen:1,un_seen:0}})
	if(dfses.count == 0){unic_per_ses=1;superunic_per_ses=1;}else if(dfses.dorthin==this.path){
    console.log("PATH AND DORTCHIN EQAL!");
	console.log("SESS COUNT :", session.count)
	unic_per_ses=0;
	//superunic_per_ses=0;
	}
	else if(dfses.dorthin!==this.path){console.log('PATH and DORTHIN NOT EQAL!!!');
	console.log("SESS COUNT :", session.count);
	//session.count=0;
	unic_per_ses=1;
	//superunic_per_ses=0;
	}
	else{unic_per_ses=0;
	//superunic_per_ses=0;
	}
	}catch(err){console.log("Session sid not found: ",err);unic_per_ses=0;}
}else{unic_per_ses=0;
//superunic_per_ses=0;
}	
try{
yield posts.updateById(this.params.id,{$inc:{gesamt_seen:1,unic_seen:unic_per_ses}/*,$set:{superunic_per_ses:[]}*/,$addToSet:{superunic_per_ses:sidd}});
}catch(er){console.log(er)}

//}catch(er){console.log('ERROR in rekwest :',er)}
}catch(err){this.status=404;
 this.flash={fucker:err.toString()};
 this.redirect('/error-view');}
 this.session.dorthin=this.path;	
});

fuckall.get('/obuli_unic',function *(){
	var db=this.fuck;
var db_ses=wrap(db.get('sessions'));
var num='561f7086bb672c804e7810d5';
this.session.count=0;
/*
try{
var a=yield db_ses.updateById(num,{$set:{count:"0"}});}catch(er){this.throw(404,er);}*/
/*try{
	var a=yield db_ses.findAndModify({query:{count:{$exists:true}},update:{$set:{count:0}}},{new:true})
}catch(e){this.throw(404,e)}*/
yield this.body={info:'anuliert sessioon!',body:'a'}	
//node index
})

fuckall.get('/obuli_unic-codeblog/:id/:a',function *(id){
	var db=this.fuck;
	console.log(this.params.id);
	
	var posts=wrap(db.get('codeblogs'));
	try{
		var post=yield posts.updateById(this.params.id,{$set:{unic_seen:0/*,gesamt_seen:0*/}})
		console.log('obnulilo?',post)
		}catch(er){this.throw(404,er)}
		//this.set("Cache-Contol","no-cache,no-strore")
	yield this.body={stat:"OK"}
})
fuckall.get('/alfa',function *(){
	
 /***
 sendgrid.send({to:'gr@yandex.ru',
               from:'a@yandex.ru',
               subject:'Hello Hujarkus!!!',
               text:'Sending email from heroku, eine Probe,alikon.herokuapp,  by admin Globi. OK?'},
function(err,json){
if(err){return console.log(err);}
console.log(json);});
***/
var b=yield fs.readFile('view/username.html','utf-8');
//this.type="text/html";

 yield this.body={str:"get alfa: OK xhr",data:b};
//yield this.render('files',{user:this.req.user,str:"str",data:"34"});
});
	
fuckall.get('/beta/:name',function *(name){
console.log('this.params.name',this.params.name);
yield this.body={str:this.params.name};
	});


module.exports=fuckall