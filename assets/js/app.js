document.documentElement.classList.add("js");
var SHOP_WA="8562054800302"; // ປ່ຽນເປັນເບີ WhatsApp ຂອງຮ້ານ (ລະຫັດປະເທດ ບໍ່ມີ +)
var CATS=["ທັງໝົດ","ແລັບທ໋ອບ","ຄອມຕັ້ງໂຕະ","ຊິ້ນສ່ວນ","ອຸປະກອນເສີມ"];
var P=[];
function loadCart(){var c={};try{var r=JSON.parse(localStorage.getItem("cart_v1")||"{}");Object.keys(r).forEach(function(k){var q=parseInt(r[k],10);if(q>0)c[k]=q})}catch(e){}return c}
function saveCart(){try{localStorage.setItem("cart_v1",JSON.stringify(cart))}catch(e){}}
var cart=loadCart(),cat="ທັງໝົດ",term="",order="def",bf="",pf="";
function fmt(n){return n.toLocaleString("en-US")+" ₭"}
function ribbon(p){if(p.s<1)return p.pre?'<span class="rb pre">ສັ່ງຈອງ</span>':'<span class="rb out">ໝົດ</span>';if(p.old>p.p)return '<span class="rb hot">-'+Math.round((1-p.p/p.old)*100)+'%</span>';if(p.s<5)return '<span class="rb warn">ເຫຼືອ '+p.s+'</span>';return ""}
function brands(){var s=document.getElementById("brand"),cur=bf,b=[];P.forEach(function(p){if(b.indexOf(p.b)<0)b.push(p.b)});b.sort();s.innerHTML='<option value="">ທຸກຍີ່ຫໍ້</option>'+b.map(function(x){return '<option value="'+E(x)+'">'+E(x)+'</option>'}).join("");s.value=b.indexOf(cur)>-1?cur:"";bf=s.value}
function inRange(v){if(!pf)return true;var a=pf.split("-"),lo=+a[0]||0,hi=a[1]?+a[1]:Infinity;return v>=lo&&v<hi}
function ck(k){var a=String(k).split(":");return{p:P.find(function(x){return x.id==a[0]}),vi:a[1]===undefined?-1:+a[1]}}
function unit(k){var o=ck(k),p=o.p;if(!p)return null;var v=o.vi>=0?p.v[o.vi]:null;if(o.vi>=0&&!v)return null;var st=v?v.s:p.s,pre=!!p.pre&&st<1;return{p:p,v:v,pre:pre,name:p.n+(v?" ("+v.n+")":"")+(pre?" [ສັ່ງຈອງ]":""),price:v?v.p:p.p,stock:st,max:pre?20:st}}
function vp(p,i){return{p:p.v[i].p,old:0}}
function vblock(p,sel){return p.v&&p.v.length?'<h4>ເລືອກແບບ</h4><div class="vopts" role="group" aria-label="ເລືອກແບບ">'+p.v.map(function(v,i){return '<button type="button" class="vopt" data-vi="'+i+'" aria-pressed="'+(i===sel)+'"'+(v.s<1&&!p.pre?' disabled':'')+'><span>'+E(v.n)+'</span><b class="num">'+fmt(v.p)+'</b>'+(v.s<1?(p.pre?'<i class="w">ສັ່ງຈອງ</i>':'<i>ໝົດ</i>'):v.s<5?'<i class="w">ເກືອບໝົດ</i>':'')+'</button>'}).join("")+'</div>':""}
function priceHtml(p){return (p.vr?'<small class="from">ເລີ່ມ</small> ':"")+'<span class="price num">'+fmt(p.p)+'</span>'+(p.old>p.p?'<s class="old">'+fmt(p.old)+'</s><span class="offtag">-'+Math.round((1-p.p/p.old)*100)+'%</span>':"")}
function relBlock(p){var l=P.filter(function(x){return x.c===p.c&&x.id!==p.id}).slice(0,3);return l.length?'<h4>ສິນຄ້າທີ່ຄ້າຍກັນ</h4><div class="rel">'+l.map(function(x){return '<button type="button" class="relc" data-rel="'+x.id+'">'+pic(x)+'<span>'+E(x.n)+'</span><b class="num">'+fmt(x.p)+'</b></button>'}).join("")+'</div>':""}
function chips(){brands();var el=document.getElementById("chips");el.innerHTML="";CATS.forEach(function(c){var b=document.createElement("button");b.className="chip";b.textContent=c;b.setAttribute("aria-pressed",c===cat);b.onclick=function(){cat=c;chips();draw()};el.appendChild(b)})}
function draw(){
  var l=P.filter(function(p){return(cat==="ທັງໝົດ"||p.c===cat)&&(!bf||p.b===bf)&&inRange(p.p)&&(p.b+" "+p.n+" "+p.c).toLowerCase().indexOf(term)>-1});
  if(order==="asc")l.sort(function(a,b){return a.p-b.p});if(order==="desc")l.sort(function(a,b){return b.p-a.p});
  var g=document.getElementById("grid");
  if(!P.length){g.innerHTML='<div class="empty">ຍັງບໍ່ມີສິນຄ້າ. ກັບມາເບິ່ງໃໝ່ໄວໆນີ້ເດີ.</div>';return}
  if(!l.length){g.innerHTML='<div class="empty">ບໍ່ພົບສິນຄ້າທີ່ຄົ້ນຫາ. ລອງຄຳອື່ນ ຫຼື ເລືອກ “ທັງໝົດ”.</div>';return}
  g.innerHTML=l.map(function(p){return '<article class="card">'+ribbon(p)+'<button class="pic" data-open="'+p.id+'" aria-label="ເບິ່ງລາຍລະອຽດ '+p.n+'">'+pic(p)+'</button><div class="body"><span class="brand">'+p.b+' · '+p.c+'</span>'+condBadge(p)+'<h3><a href="#" data-open="'+p.id+'">'+p.n+'</a></h3><div class="foot"><span>'+priceHtml(p)+'</span><button class="add" data-id="'+p.id+'"'+(p.v.length||p.s>0||p.pre?'':' disabled')+'>'+(p.v.length?'ເລືອກແບບ':p.s<1?(p.pre?'ສັ່ງຈອງ':'ໝົດ'):'ໃສ່ກະຕ່າ')+'</button></div><button class="more" data-open="'+p.id+'">ເບິ່ງສະເປັກ ແລະ ລາຍລະອຽດ</button><span class="stock'+(p.s<5?' low':'')+'">'+(p.s<1?(p.pre?'ສັ່ງຈອງໄດ້':'ໝົດ'):p.s<5?'ເຫຼືອ '+p.s+' ຊິ້ນ':'ມີສິນຄ້າ')+'</span></div></article>'}).join("");
}
function upd(){
  var ids=Object.keys(cart),n=0,t=0,h="",hp=false;
  ids.forEach(function(id){var u=unit(id),q=cart[id];if(!u){delete cart[id];return}n+=q;t+=u.price*q;if(u.pre)hp=true;
    h+='<div class="row"><div>'+E(u.name)+'<br><small class="num">'+fmt(u.price)+'</small></div><div class="qty"><button data-d="-1" data-id="'+id+'" aria-label="ຫຼຸດ">−</button><b>'+q+'</b><button data-d="1" data-id="'+id+'" aria-label="ເພີ່ມ">+</button></div></div>'});
  document.getElementById("items").innerHTML=h||'<div class="empty" style="margin:12px 0">ກະຕ່າຍັງຫວ່າງ. ເລືອກສິນຄ້າແລ້ວກົດ “ໃສ່ກະຕ່າ”.</div>';
  document.getElementById("cnt").textContent=n;document.getElementById("total").textContent=fmt(t);var pn=document.getElementById("prenote");if(pn)pn.hidden=!hp;saveCart();
}
function change(id,d){var u=unit(id);if(!u)return;cart[id]=Math.min((cart[id]||0)+d,u.max);if(cart[id]<=0)delete cart[id];upd()}
document.getElementById("grid").onclick=function(e){var o=e.target.closest("[data-open]");if(o){e.preventDefault();openD(+o.dataset.open);return}var b=e.target.closest(".add");if(b){var pp=P.find(function(x){return x.id==b.dataset.id});if(pp&&pp.v.length){openD(pp.id);return}change(b.dataset.id,1);var c=document.getElementById("openCart");c.animate([{transform:"scale(1.08)"},{transform:"scale(1)"}],{duration:200})}};
document.getElementById("items").onclick=function(e){var b=e.target.closest("button[data-d]");if(b)change(b.dataset.id,+b.dataset.d)};
document.getElementById("q").oninput=function(e){term=e.target.value.toLowerCase().trim();draw()};
document.getElementById("sort").onchange=function(e){order=e.target.value;draw()};
document.getElementById("brand").onchange=function(e){bf=e.target.value;draw()};
document.getElementById("prange").onchange=function(e){pf=e.target.value;draw()};
var dlg=document.getElementById("cart");
function sw(o){return Swal.fire(Object.assign({target:document.querySelector("dialog[open]")||document.body,background:"var(--surf)",color:"var(--ink)",confirmButtonColor:"#1f5bff",confirmButtonText:"ຕົກລົງ"},o))}
document.getElementById("openCart").onclick=function(){dlg.showModal()};
document.getElementById("closeCart").onclick=function(){dlg.close()};
dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});
var slipData=null,QR_SRC="assets/img/shop-qr.jpg";
function pm(){var r=document.querySelector('input[name="pm"]:checked');return r?r.value:"transfer"}
function shrinkImg(file,max,q){return new Promise(function(ok,no){var im=new Image(),u=URL.createObjectURL(file);im.onload=function(){var r=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*r);c.height=Math.round(im.height*r);c.getContext("2d").drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);ok(c.toDataURL("image/jpeg",q))};im.onerror=function(){no(new Error("ອ່ານຮູບບໍ່ໄດ້"))};im.src=u})}
function payStep(t){
  return sw({title:"ໂອນເງິນຜ່ານ QR",width:380,showCancelButton:true,confirmButtonText:"ຢືນຢັນການສັ່ງຊື້",cancelButtonText:"ກັບຄືນ",
    html:'<div class="payswal"><img src="'+QR_SRC+'" alt="QR ໂອນເງິນ"><p>ຍອດທີ່ຕ້ອງໂອນ: <b class="num">'+fmt(t)+'</b></p><a class="more" href="'+QR_SRC+'" download="DN-Game-Vault-QR.jpg">ບັນທຶກຮູບ QR</a><label class="slip">ແນບສະລິບໂອນເງິນ (ແນະນຳ)<input id="sw-slip" type="file" accept="image/*"></label><div id="sw-prev"></div><p class="note">ໂອນແລ້ວແນບສະລິບ ແລ້ວກົດ “ຢືນຢັນການສັ່ງຊື້”</p></div>',
    didOpen:function(){var inp=document.getElementById("sw-slip"),pv=document.getElementById("sw-prev");
      function show(){pv.innerHTML=slipData?'<img src="'+slipData+'" alt="ສະລິບ"><button type="button" id="sw-rm">ລຶບ</button>':"";if(slipData)document.getElementById("sw-rm").onclick=function(){slipData=null;show()}}
      show();inp.onchange=function(){var f=inp.files[0];inp.value="";if(!f)return;shrinkImg(f,1000,.72).then(function(d){if(d.length>650000){Swal.showValidationMessage("ຮູບໃຫຍ່ເກີນ ລອງຕັດຮູບສະລິບໃໝ່");return}slipData=d;show()}).catch(function(x){Swal.showValidationMessage(x.message)})}}})
}
document.getElementById("order").onclick=async function(e){
  e.preventDefault();var ids=Object.keys(cart);if(!ids.length){sw({icon:"info",title:"ກະຕ່າຍັງຫວ່າງ",text:"ເລືອກສິນຄ້າກ່ອນສັ່ງຊື້ເດີ"});return}
  var nm=document.getElementById("name").value.trim(),ph=document.getElementById("phone").value.trim(),ad=document.getElementById("addr").value.trim();
  if(!nm||ph.replace(/\D/g,"").length<8){sw({icon:"warning",title:"ກະລຸນາໃສ່ຊື່ ແລະ ເບີໂທໃຫ້ຄົບ"}).then(function(){document.getElementById(nm?"phone":"name").focus()});return}
  var method=pm();
  var t=0,m="ສະບາຍດີ, ຂໍສັ່ງຊື້:\n";
  ids.forEach(function(id){var u=unit(id);t+=u.price*cart[id];m+="- "+u.p.b+" "+u.name+" x"+cart[id]+" = "+fmt(u.price*cart[id])+"\n"});if(ids.some(function(id){return unit(id).pre}))m+="* ມີສິນຄ້າສັ່ງຈອງ (ຍັງບໍ່ມີໃນສະຕັອກ) ກະລຸນາແຈ້ງເວລາຮອດ\n";
  m+="ລວມ: "+fmt(t)+"\nຊື່: "+nm+"\nເບີ: "+ph+"\nທີ່ຢູ່: "+(ad||"ມາຮັບທີ່ຮ້ານ"); 
  if(method==="transfer"){var pr=await payStep(t);if(!pr.isConfirmed)return}
  m+="\nຊຳລະ: "+(method==="transfer"?(slipData?"ໂອນຜ່ານ QR (ແນບສະລິບແລ້ວ)":"ໂອນຜ່ານ QR (ຈະສົ່ງສະລິບທາງ WhatsApp)"):"ຈ່າຍເງິນສົດ");
  if(window.saveOrder){try{await window.saveOrder({name:nm,phone:ph,address:ad||"ມາຮັບທີ່ຮ້ານ",total:t,payMethod:method,slip:slipData||null,items:ids.map(function(id){var u=unit(id);return{id:u.p.id,pid:u.p.doc||null,vi:u.v?+String(id).split(":")[1]:null,name:u.name,qty:cart[id],price:u.price,pre:u.pre?true:null}}),hasPre:ids.some(function(id){return unit(id).pre})});cart={};slipData=null;upd();}catch(err){sw({icon:"error",title:"ສັ່ງຊື້ບໍ່ສຳເລັດ",text:err.message||"ລອງໃໝ່ອີກຄັ້ງ"});return}}
  await sw({icon:"success",title:"ຮັບອໍເດີແລ້ວ",text:"ກຳລັງເປີດ WhatsApp ເພື່ອຢືນຢັນກັບຮ້ານ...",timer:1800,timerProgressBar:true,showConfirmButton:false});
  location.href="https://wa.me/"+SHOP_WA+"?text="+encodeURIComponent(m);
};
function pic(p){return p.img&&p.img.length?'<img src="'+p.img[0]+'" alt="'+p.n+'" loading="lazy">':art(p.id)}
function thumbs(p){return p.img&&p.img.length>1?'<div class="thumbs">'+p.img.map(function(u,i){return '<button data-i="'+i+'" aria-label="ຣູບ '+(i+1)+'" aria-pressed="'+(i===0)+'"><img src="'+u+'" alt=""></button>'}).join("")+'</div>':""}
var K={};
function art(id){
  var k=K[id],g=k==="lg"||k==="dg",h='<svg viewBox="0 0 240 150" role="img" aria-hidden="true">';
  if(k==="l"||k==="lg")h+='<rect class="a1" x="50" y="16" width="140" height="90" rx="7"/><rect class="a2" x="57" y="23" width="126" height="76" rx="2"/><rect class="a6" x="66" y="32" width="54" height="6" rx="3"/><rect class="a6" x="66" y="44" width="80" height="4" rx="2"/><rect class="a6" x="66" y="54" width="64" height="4" rx="2"/><rect class="a1" x="26" y="106" width="188" height="16" rx="5"/><rect class="a4" x="100" y="106" width="40" height="5" rx="2"/>'+(g?'<rect class="a5" x="34" y="117" width="172" height="3" rx="1"/>':'');
  if(k==="d"||k==="dg")h+='<rect class="a1" x="14" y="14" width="128" height="86" rx="7"/><rect class="a2" x="20" y="20" width="116" height="74" rx="2"/><rect class="a6" x="28" y="28" width="50" height="6" rx="3"/><rect class="a6" x="28" y="40" width="76" height="4" rx="2"/><rect class="a1" x="70" y="100" width="16" height="16"/><rect class="a1" x="52" y="114" width="52" height="7" rx="3"/><rect class="a1" x="162" y="20" width="62" height="108" rx="7"/><rect class="a4" x="168" y="26" width="36" height="96" rx="3"/><circle class="'+(g?'a5':'a2')+'" cx="186" cy="50" r="13"/><circle class="'+(g?'a5':'a2')+'" cx="186" cy="96" r="13"/><circle class="a1" cx="186" cy="50" r="4"/><circle class="a1" cx="186" cy="96" r="4"/><circle class="a5" cx="214" cy="34" r="3"/>';
  if(k==="s")h+='<rect class="a1" x="34" y="52" width="180" height="46" rx="5"/><rect class="a5" x="20" y="58" width="16" height="34"/><rect class="a4" x="70" y="60" width="32" height="30" rx="3"/><rect class="a4" x="110" y="60" width="32" height="30" rx="3"/><rect class="a2" x="150" y="60" width="32" height="30" rx="3"/><circle class="a4" cx="202" cy="75" r="5"/>';
  if(k==="r")h+='<rect class="a1" x="22" y="40" width="196" height="62" rx="5"/><rect class="a2" x="36" y="52" width="24" height="26" rx="2"/><rect class="a2" x="68" y="52" width="24" height="26" rx="2"/><rect class="a2" x="100" y="52" width="24" height="26" rx="2"/><rect class="a2" x="132" y="52" width="24" height="26" rx="2"/><rect class="a2" x="164" y="52" width="24" height="26" rx="2"/><rect class="a5" x="22" y="102" width="196" height="10"/><rect class="a4" x="112" y="102" width="6" height="10"/>';
  if(k==="m")h+='<rect class="a1" x="86" y="16" width="68" height="118" rx="34"/><rect class="a4" x="119" y="16" width="2" height="46"/><rect class="a5" x="115" y="38" width="10" height="18" rx="5"/><rect class="a2" x="100" y="88" width="40" height="6" rx="3"/>';
  return h+'</svg>';
}
function applyShop(s){
  if(!s)return;var $=function(i){return document.getElementById(i)};
  var d=String(s.whatsapp||"").replace(/\D/g,"");
  if(d){if(d.indexOf("856")!==0)d="856"+d.replace(/^0+/,"");SHOP_WA=d;["f-fab","hero-wa","cta-wa"].forEach(function(i){if($(i))$(i).href="https://wa.me/"+d+"?text="+encodeURIComponent("ສະບາຍດີ ຢາກສອບຖາມສິນຄ້າ")});
    var f=d.replace(/^(856)(20)(\d{4})(\d{4})$/,"+$1 $2 $3 $4");if($("f-wa")){$("f-wa").href="https://wa.me/"+d;$("f-wa").textContent=f===d?"+"+d:f}}
  if(s.address&&$("f-addr"))$("f-addr").textContent="ທີ່ຢູ່: "+s.address;
  if(s.hours&&$("f-hours"))$("f-hours").textContent="ເປີດ: "+s.hours;
  if(/^https:\/\//.test(s.facebook||"")){if($("f-fb"))$("f-fb").href=s.facebook;if($("fb-btn"))$("fb-btn").href=s.facebook}
  if(s.qrImage)QR_SRC=s.qrImage;
  if(/^https?:\/\//.test(s.map||"")&&$("f-map")){$("f-map").href=s.map;$("f-map").hidden=false}
  var pi=[s.payinfo,s.shipinfo].filter(Boolean).join("\n\n");if($("payinfo")){$("payinfo").hidden=!pi;$("payinfo-body").textContent=pi}
}
function E(t){return String(t==null?"":t).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
var COND={"new":"ເຄື່ອງໃໝ່",used:"ມືສອງ",refurb:"ມືສອງ ຜ່ານການເຊັກ",open:"ເປີດກ່ອງ (ຕົວໂຊ)"};
function condBadge(p){return p.cond&&p.cond!=="new"?' <span class="tag warn">'+E(COND[p.cond]||p.cond)+'</span>':""}
function tagHtml(p){return '<span class="tag">'+E(COND[p.cond||"new"]||"ເຄື່ອງໃໝ່")+'</span>'+(p.war?'<span class="tag ok">ຮັບປະກັນ '+E(p.war)+'</span>':"")}
function shareUrl(p){return location.href.split("#")[0]+"#p="+p.id}
function askUrl(p){return "https://wa.me/"+SHOP_WA+"?text="+encodeURIComponent("ສະບາຍດີ, ສົນໃຈ "+p.b+" "+p.n+" ("+fmt(p.p)+")\n"+shareUrl(p))}
var DESC={"ແລັບທ໋ອບ":"ເຄື່ອງພົກພາ ເໝາະກັບການຮຽນ, ເຮັດວຽກ ແລະ ເບິ່ງໜັງ. ທາງຮ້ານເຊັກເຄື່ອງ ແລະ ລົງໂປຣແກຣມໃຫ້ກ່ອນສົ່ງມອບ.","ຄອມຕັ້ງໂຕະ":"ຄອມປະກອບໂດຍຊ່າງຂອງຮ້ານ ທົດສອບແລ້ວ 24 ຊົ່ວໂມງ. ສາມາດອັບເກຣດ RAM, SSD ຫຼື ກາດຈໍພາຍຫຼັງໄດ້.","ຊິ້ນສ່ວນ":"ຊິ້ນສ່ວນສຳລັບອັບເກຣດຄອມ. ບອກຮຸ່ນຄອມຂອງເຈົ້າ ທາງຮ້ານຈະຊ່ວຍກວດວ່າໃຊ້ໄດ້ກັບເຄື່ອງ.","ອຸປະກອນເສີມ":"ອຸປະກອນເສີມທີ່ໃຊ້ໄດ້ກັບຄອມທົ່ວໄປ ເສຽບແລ້ວໃຊ້ໄດ້ທັນທີ."};
var INC={"ແລັບທ໋ອບ":["ເຄື່ອງ + ສາຍສາກ + ໃບຮັບປະກັນ","ລົງ Windows ແລະ ໂປຣແກຣມພື້ນຖານຟຣີ","ກະເປົ໋າ ຫຼື ເມົ້າ ຕາມໂປຣໂມຊັນ"],"ຄອມຕັ້ງໂຕະ":["ປະກອບ + ທົດສອບຟຣີ","ລົງ Windows ແລະ ໂປຣແກຣມຟຣີ","ຮັບປະກັນຊິ້ນສ່ວນ 1–3 ປີ"],"ຊິ້ນສ່ວນ":["ຕິດຕັ້ງໃຫ້ຟຣີທີ່ຮ້ານ","ໃບຮັບປະກັນຜູ້ຜະລິດ"],"ອຸປະກອນເສີມ":["ໃບຮັບປະກັນ 1 ປີ","ເຊັກສິນຄ້າກ່ອນຮັບ"]};
var dlgD=document.getElementById("detail");
function openD(id){
  var p=P.find(function(x){return x.id===id}),vs=p.v||[],sel=Math.max(0,vs.findIndex(function(v){return v.s>0}));
  document.getElementById("dbody").innerHTML='<div class="big" id="bigpic">'+pic(p)+'</div>'+thumbs(p)+'<div class="dinfo"><span class="brand">'+p.b+' · '+p.c+'</span><h3>'+p.n+'</h3><div class="tags">'+tagHtml(p)+'</div>'+vblock(p,sel)+'<span id="dstock" class="stock"></span><p class="desc">'+(p.desc?E(p.desc):DESC[p.c])+'</p><h4>ສະເປັກ</h4><ul class="specs">'+p.sp.map(function(s){return '<li><span>'+s[0]+'</span><b>'+s[1]+'</b></li>'}).join("")+'</ul><h4>ລວມຢູ່ໃນລາຄາ</h4><ul class="inc">'+INC[p.c].map(function(t){return '<li>'+t+'</li>'}).join("")+'</ul><div class="dact"><span id="dprice">'+priceHtml(vs.length?vp(p,sel):p)+'</span><div class="qsel"><button type="button" class="more" id="qm" aria-label="ຫຼຸດ">−</button><b id="qv" class="num">1</b><button type="button" class="more" id="qp" aria-label="ເພີ່ມ">+</button></div><button class="add" id="addD">ໃສ່ກະຕ່າ</button></div><div class="dact2"><a class="more" id="askD" target="_blank" rel="noopener" href="'+askUrl(p)+'">ສອບຖາມຜ່ານ WhatsApp</a><button class="more" id="shareD" type="button">ແຊຣ໌ລິ້ງສິນຄ້າ</button></div>'+relBlock(p)+'</div>';
  try{history.replaceState(null,"","#p="+id)}catch(e){}
  var q=1,qv=document.getElementById("qv"),cs=function(){return vs.length?vs[sel].s:p.s};
  function refresh(){
    document.querySelectorAll(".vopt").forEach(function(x){x.setAttribute("aria-pressed",+x.dataset.vi===sel)});
    if(vs.length){document.getElementById("dprice").innerHTML=priceHtml(vp(p,sel));var vi=vs[sel].img;document.getElementById("bigpic").innerHTML=vi?'<img src="'+E(vi)+'" alt="'+E(p.n)+'">':pic(p);document.querySelectorAll(".thumbs button").forEach(function(b){b.setAttribute("aria-pressed",vi?p.img[+b.dataset.i]===vi:+b.dataset.i===0)})}
    var s=cs(),st=document.getElementById("dstock"),a=document.getElementById("addD");
    st.className="stock"+(s<5?" low":"");st.textContent=s<1?(p.pre?"ສັ່ງຈອງໄດ້"+(p.eta?" · ຄາດວ່າຮອດ "+p.eta:""):"ໝົດ"):s<5?"ເຫຼືອ "+s+" ຊິ້ນ":"ມີສິນຄ້າ";
    a.disabled=s<1&&!p.pre;a.textContent=s<1&&p.pre?"ສັ່ງຈອງ":"ໃສ່ກະຕ່າ";qv.textContent=q;
  }
  document.querySelectorAll(".vopt").forEach(function(b){b.onclick=function(){sel=+b.dataset.vi;q=1;refresh()}});
  document.getElementById("qm").onclick=function(){if(q>1){q--;qv.textContent=q}};
  document.getElementById("qp").onclick=function(){if(q<(cs()<1&&p.pre?20:Math.max(1,cs()))){q++;qv.textContent=q}};
  document.getElementById("addD").onclick=function(){change(vs.length?id+":"+sel:id,q);this.textContent="ເພີ່ມ "+q+" ຊິ້ນແລ້ວ ✓"};
  refresh();
  document.querySelectorAll(".relc").forEach(function(b){b.onclick=function(){openD(+b.dataset.rel)}});
  document.getElementById("shareD").onclick=function(){var u=shareUrl(p);
    var done=function(){Swal.fire({toast:true,position:"top",icon:"success",title:"ກ໊ອບລິ້ງແລ້ວ",showConfirmButton:false,timer:1800,target:dlgD,background:"var(--surf)",color:"var(--ink)"})};
    var manual=function(){sw({title:"ກ໊ອບລິ້ງນີ້",input:"text",inputValue:u,confirmButtonText:"ປິດ"})};
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(u).then(done,manual);else manual()};
  document.querySelectorAll(".thumbs button").forEach(function(b){b.onclick=function(){
    document.getElementById("bigpic").innerHTML='<img src="'+p.img[+b.dataset.i]+'" alt="'+p.n+'">';
    document.querySelectorAll(".thumbs button").forEach(function(x){x.setAttribute("aria-pressed",x===b)})}});
  if(!dlgD.open)dlgD.showModal();
  dlgD.scrollTop=0;document.getElementById("dbody").scrollTop=0;
}
document.getElementById("closeD").onclick=function(){dlgD.close()};
dlgD.addEventListener("click",function(e){if(e.target===dlgD)dlgD.close()});
dlgD.addEventListener("close",function(){try{history.replaceState(null,"",location.href.split("#")[0])}catch(e){}});
function openFromHash(){var m=/^#p=(\d+)$/.exec(location.hash);if(!m)return;var id=+m[1];if(!dlgD.open&&P.some(function(x){return x.id===id}))openD(id)}
window.addEventListener("hashchange",openFromHash);
chips();draw();upd();

document.getElementById("cats").onclick=function(e){var b=e.target.closest("[data-cat]");if(!b)return;cat=b.dataset.cat;chips();draw();document.getElementById("products").scrollIntoView({behavior:"smooth"})};
(function(){var els=document.querySelectorAll(".rv");if(!("IntersectionObserver" in window)||(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches)){els.forEach(function(e){e.classList.add("in")});return}
var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}})},{threshold:.1});els.forEach(function(e){io.observe(e)})})();
var yr=document.getElementById("yr");if(yr)yr.textContent=new Date().getFullYear();
