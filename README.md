# Simple photo blog based on [Koa](http://koajs.com/) and [mongoDB](https://www.mongodb.org)
#an Herbert Sager gewidmet.

With no template engine. The view pages formatted as a es6.0 tagged template strings in modules.
With purpose of better perfomance by html rendering on server side. In developing mode you may need something
like forever.js or hot reloading module reloadjs.

```javascript
//views/haupt_page.js
let haupt_page = n => `
<!DOCTYPE html><html lang="en">
<head></head>
<body>
<b>Some variable: </b>${getVar(n)}</body></html>`;
module.exports={haupt_page};
function getVar(n){
var str='';
if(n.post){
n.post.forEach(el => {
str+=`<li>${el.title}</li><li>${el.author}</li>`;
});
}
return str;
}
//server.js
var {haupt_page}=require('./haupt_page.js');
router.get('/',function *(){
var db=this.db;
var docs=db.collection('posts');
try{
var post=yield docs.find().toArray();}catch(err){}
this.type="html";
this.body=haupt_page({post});// or this.render('haupt_page',{post})
})
```

### db.collection('posts')

* title:         'Horse Dentistry'
* sub_title:     'Equestrian Life - Expense Report'
* slug:          'horse-dentistry'
* author:        'Bob'
* created_on:     `new Date()`
* slogan:        'Stop Wasting Teeth!'
* description(for fb, twitter and Co):   'Just like humans, horses need regular dental care. Learn about
                                          equine teeth and find out when you need to schedule a visit 
										  from the horse dentist.'
* leader:        'HI talks to horse owners across the nation to compare horsekeeping expenses.'
* body:          'It\'s something most of us would rather not think about: how much money we spend on
                  our horses every month. After all, if we start adding up those numbers, bla bla bla...'
* foto_cover:    'cover_pic_for_this_article.png'
* category:      'horses'
* rubrik:        'horse care'
* images:        `[{src: 'horse-m1_384px.png', src1: 'horse-m2_786px.png', src2: 'horse-m3_1152px.png',
                    src3: 'horse-m4_1536px.png', title:'Horse', content:'Horse feeds canabis',
					from:'http://other_site.com'}]`
* tags:          ['horse', 'health'\]
* gesamt_seen:   0
* last_modified: `new Date()` or by update `{$currentDate:{created_on: true}}`
* date_url:      `new Date().getTime().toString().slice(0,8)` 
//`http://example.com/articles/14507100/horse-dentristry`
* type:          'article'
* part:          0
* status:        'active'

# Each view includes submodules

##### haupt_page.js

* head
* warnig/=bool
* header_menu
* admin_main_menu//if admin
* haupt_banner/=bool
* footer

##### articles_page.js

* head
* warnig
* header_menu
* admin_main_menu
* haupt_banner
* articles_block
* paginator
* footer

##### articles_page_page.js

* head
* warnig
* header_menu
* admin_main_menu
* haupt_banner
* articles_block
* paginator
* footer

##### articles_view.js

* head
* header_menu
* admin_main_menu
* footer

##### labs.js

##### login.js

* head
* admin_main_menu

##### admin_dashboard
* admin_main_menu

##### admin_dashboard_articles

* admin_main_menu

$git remote add origin https://github.com/Globik/alikon.git
##
$git push -u origin master
##
From heroku to github.
##
The command goes from my directory on my computer where is the folder with alikon app....

# node-js-getting-started

A barebones Node.js app using [Koa](http://koajs.com/).

This application support the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:3000](http://127.0.0.1:3000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```



































