//cabinet.js
var head=require('./head'),
    header_menu=require('./header_menu'),
	admin_main_menu=require('./admin_main_menu'),
    footer=require('./footer');
var warnig=false;	  
var haupt_ban=false;

var cabinet = n=>{
var {buser,model,showmodule:{mainmenu,profiler}}=n;
	//console.log('BUSER: ',buser);
return `<!DOCTYPE html><html lang="en"><!-- busers.js -->
<head>${head.head({title:"Cabinet", csslink:"/css/main2.css"})}</head>
<body>${(warnig ? `<div id="warnig">Warnig</div>`:``)}
<nav class="back">${header_menu.header_menu({buser,mainmenu,profiler})}</nav>
${(haupt_ban ? `<div id="haupt-banner"><div id="real-ban">Banner</div></div>` : ``)}
${((buser && buser.role=='superadmin') ? `${admin_main_menu.admin_main_menu({})}`:``)}
<main id="pagewrap"> 
<style>
.cardadr{border:1px solid green;}
</style>
<li><a href="/api/anketa" onclick="get_anketa();">anketa</a>
<li><a href="/api/payout">tokens</a>
<li><a href="/api/settlement">settlement</a>
<span id="useremail">gru5@yandex.ru</span>
<h4>bitcoin address.</h4> Edit.
<br>${get_card(n)}
<script>
function get_anketa(el){
//mit_xhr(el.href+"/");
}
//alert(useremail.textContent.substring(0,useremail.textContent.indexOf("@")))
</script>
</main><footer id="footer">${footer.footer({})}</footer>
</body>
</html>`;
}
module.exports={cabinet};
function get_card(n){
let s='';
	if(n.cards){
	s+=`<div class="cardadr"><span id="cardaddr">${n.cards.addr}</span></div>`;
	}else{
	s+=`<div class="cardadr">Add one</div>`;
	}
	return s;
}