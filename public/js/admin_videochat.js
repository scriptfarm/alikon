function get_one_abuse(){
window.location.href="#one_abuse";
}
function ban_model(){
let d={};
	d.bn_us_id=modelId;
	d.bn_us_by=yourId;
	d.bn_slc=complainiSelector.value;
	d.bn_cmt=txarComplain.value;
	d.bn_status='yes';
	d.is_banned=is_banned();
ban_user_xhr(d);
}
function ban_model2(el){
//banned_users(bn_us_id,bn_us_by,bn_status,bn_cmt,bn_slc)
let d={};
	d.bn_us_id=modelId;
	d.bn_us_by=yourId;
	d.bn_slc=el.getAttribute('data-ab_slc');
	d.bn_cmt=el.getAttribute('data-ab_cmt');
	d.bn_status='yes';
	d.is_banned=is_banned();
ban_user_xhr(d);
}
function socket_to_ban_user(){
let outi={};
outi.msg='You banned from broadcasting.';
outi.from_nick='moderator';
outi.type="message";
outi.admin_type="stop_broadcast";
outi.target=modelName;
sendJson(outi)
sendJson({type:"message",msg:modelName+" is banned.",from_nick:/*myusername*/"moderator"})
gid('is_banned').value="yes";
}

function ban_user_xhr(d){
if(is_banned()){alert('Already is banned!');return;}
var xhr=new XMLHttpRequest();
xhr.open('post','/api/set_ban_user_two');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
console.warn('xhr from server: ',this.response);
let bi=JSON.parse(this.response);
if(bi.bstatus==2){
alert(bi.info);
socket_to_ban_user();
}
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
//xhr.send(JSON.stringify(d));
socket_to_ban_user();
}

function not_ban(){
var xhr=new XMLHttpRequest();
xhr.open('post','/api/skip_ban_user');
xhr.setRequestHeader('Content-Type','application/json','utf-8');
xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
xhr.onload=function(e){
if(xhr.status==200){
let bi=JSON.parse(this.response);
console.warn('xhr from server: ',this.response);
}else{
alert(this.response);
}}
xhr.onerror=function(e){console.error(e)};
let d={};
	d.abus_id=modelId;//el.value;
	let a=JSON.stringify(d);
	alert(a);
//xhr.send(a);
}
function ban_out(){
if(!is_banned()){alert('This user is already ban out!');return;}
let d={}
d.model_id=modelId;
d.bn_status='no';
d.bstatus='end';
alert(modelId)
}