//articles_block.js
'use strict';
var moment=require('moment');  
var zagl=true;
var metatagsector=false;  
const articles_block=n=>`${n.posts ? getArt(n) : ``}${zagl ? getZaglushkaPost(n) : ``}`;
module.exports={articles_block};
  
function getArt(n){ 
	let s=``;let {posts}=n;
	if(posts){
	for(var {id,title,sub_title,date_url,slug,images,status,created_on,tags:tags} of posts ){ 
		//if(status=='active'){
     s+=`<article class="fluiditems"><div id="redaktor"><ul class="red-nav"><li>X</li>
	<li><a onclick="redaktorHref(this)"  data-id="${id}" href="#popredaktor">redact</a></li>
<li data-id="${id}" onclick="remove_post(this)">remove</li><li>visibility ${status}</li></ul></div>
<div class="foto-cont">                 
<img src="${images.length ? `/uploads/${images[0].src1}` : '/images/kuku.png'}"/></div>	
<section class="article-info"> 
<div class="time-service"><b>${moment(created_on).format('MMM D, YYYY')}</b></div>
<div class="time-service"><b>comments 1</b></div>
<div class="time-service"><b>23 Shares</b></div>
<h5><a href="/articles/${slug}">${title}</a></h5> 
${sub_title ? `<p>${sub_title}</p>` : ''}  
	${metatagsector ? `<div class="tags">${tags? tags : ""}</div>`:""}
</section>
<div class='art-pop'>${images.length ? `<p>Photos: ${images.length}</p>`:''}
<p>Noch bla bla bla.</p></div>
</article>`;
		//}else{}
	} }
return s;
}    
function su(n){let g=``;n.forEach(el=> g+=`<b>${el}</b>`);return g;}
function getZaglushkaPost(n){
let s=``;s+=`<article class="fluiditems"> 
<div id="redaktor"><ul class="red-nav">
<li><span onclick="remove_post(this)">X</span></li><li><a onclick="redaktorHref(this)" data-id="1" href="#popredaktor">redact</a></li>
<li data-id="1" onclick="removePost(this)">remove</li><li>visibility 1</li></ul></div>
<div class="foto-cont"><img src="/images/kuku.png"/></div>
<section class="article-info">
<div class="time-service"><b>16 25, 2016</b></div><div class="time-service"><b>comments 4</b></div>
<div class="time-service"><b>23 Shares</b></div><h5><a href="">Hallo World! Fuck</a></h5><p>Sub head</p>
<div class="tags"><b>js</b><b>css3</b></div></section>
<div class='art-pop'><p>Photos: 0</p><p>Noch bla bla bla.</p></div></article>`;
return s;}
function html(s,...v){
var res='';
for(let i=0;i<v.length;i++){
res+=s[i];
res+=v[i];
}
res+=s[s.length-1];
return res.replace(/\n/g,'');
}