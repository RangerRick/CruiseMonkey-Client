function cm3(){var P='',xb='" for "gwt:onLoadErrorFn"',vb='" for "gwt:onPropertyErrorFn"',ib='"><\/script>',Z='#',Rb='.cache.html',_='/',lb='//',Ob='2A95AA48BB27D9612DC7B80E913BB7A1',Pb='57E654E73E90662CBFFE640F98AE5B18',Qb=':',pb='::',$b='<script defer="defer">cm3.onInjectionDone(\'cm3\')<\/script>',hb='<script id="',sb='=',$='?',ub='Bad handler "',Yb='CM3.css',Zb='DOMContentLoaded',jb='SCRIPT',gb='__gwt_marker_cm3',Db='android',kb='base',cb='baseUrl',T='begin',Hb='blackberry',S='bootstrap',bb='clear.cache.gif',Q='cm3',eb='cm3.nocache.js',ob='cm3::',rb='content',Y='end',Ib='file://',U='gwt.codesvr=',V='gwt.hosted=',W='gwt.hybrid',Sb='gwt/clean/clean.css',wb='gwt:onLoadErrorFn',tb='gwt:onPropertyErrorFn',qb='gwt:property',Xb='head',Mb='hosted.html?cm3',Wb='href',yb='iframe',ab='img',Eb='ipad',Gb='iphone',Fb='ipod',zb="javascript:''",Tb='link',Lb='loadExternalRefs',mb='meta',Bb='moduleRequested',X='moduleStartup',nb='name',Kb='no',Cb='phonegap.env',Ab='position:absolute;width:0;height:0;border:none',Ub='rel',db='script',Nb='selectingPermutation',R='startup',Vb='stylesheet',fb='undefined',Jb='yes';var m=window,n=document,o=m.__gwtStatsEvent?function(a){return m.__gwtStatsEvent(a)}:null,p=m.__gwtStatsSessionId?m.__gwtStatsSessionId:null,q,r,s,t=P,u={},v=[],w=[],x=[],y=0,z,A;o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:S,millis:(new Date).getTime(),type:T});if(!m.__gwt_stylesLoaded){m.__gwt_stylesLoaded={}}if(!m.__gwt_scriptsLoaded){m.__gwt_scriptsLoaded={}}function B(){var b=false;try{var c=m.location.search;return (c.indexOf(U)!=-1||(c.indexOf(V)!=-1||m.external&&m.external.gwtOnLoad))&&c.indexOf(W)==-1}catch(a){}B=function(){return b};return b}
function C(){if(q&&r){var b=n.getElementById(Q);var c=b.contentWindow;if(B()){c.__gwt_getProperty=function(a){return H(a)}}cm3=null;c.gwtOnLoad(z,Q,t,y);o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:X,millis:(new Date).getTime(),type:Y})}}
function D(){function e(a){var b=a.lastIndexOf(Z);if(b==-1){b=a.length}var c=a.indexOf($);if(c==-1){c=a.length}var d=a.lastIndexOf(_,Math.min(c,b));return d>=0?a.substring(0,d+1):P}
function f(a){if(a.match(/^\w+:\/\//)){}else{var b=n.createElement(ab);b.src=a+bb;a=e(b.src)}return a}
function g(){var a=F(cb);if(a!=null){return a}return P}
function h(){var a=n.getElementsByTagName(db);for(var b=0;b<a.length;++b){if(a[b].src.indexOf(eb)!=-1){return e(a[b].src)}}return P}
function i(){var a;if(typeof isBodyLoaded==fb||!isBodyLoaded()){var b=gb;var c;n.write(hb+b+ib);c=n.getElementById(b);a=c&&c.previousSibling;while(a&&a.tagName!=jb){a=a.previousSibling}if(c){c.parentNode.removeChild(c)}if(a&&a.src){return e(a.src)}}return P}
function j(){var a=n.getElementsByTagName(kb);if(a.length>0){return a[a.length-1].href}return P}
function k(){var a=n.location;return a.href==a.protocol+lb+a.host+a.pathname+a.search+a.hash}
var l=g();if(l==P){l=h()}if(l==P){l=i()}if(l==P){l=j()}if(l==P&&k()){l=e(n.location.href)}l=f(l);t=l;return l}
function E(){var b=document.getElementsByTagName(mb);for(var c=0,d=b.length;c<d;++c){var e=b[c],f=e.getAttribute(nb),g;if(f){f=f.replace(ob,P);if(f.indexOf(pb)>=0){continue}if(f==qb){g=e.getAttribute(rb);if(g){var h,i=g.indexOf(sb);if(i>=0){f=g.substring(0,i);h=g.substring(i+1)}else{f=g;h=P}u[f]=h}}else if(f==tb){g=e.getAttribute(rb);if(g){try{A=eval(g)}catch(a){alert(ub+g+vb)}}}else if(f==wb){g=e.getAttribute(rb);if(g){try{z=eval(g)}catch(a){alert(ub+g+xb)}}}}}}
function F(a){var b=u[a];return b==null?null:b}
function G(a,b){var c=x;for(var d=0,e=a.length-1;d<e;++d){c=c[a[d]]||(c[a[d]]=[])}c[a[e]]=b}
function H(a){var b=w[a](),c=v[a];if(b in c){return b}var d=[];for(var e in c){d[c[e]]=e}if(A){A(a,d,b)}throw null}
var I;function J(){if(!I){I=true;var a=n.createElement(yb);a.src=zb;a.id=Q;a.style.cssText=Ab;a.tabIndex=-1;n.body.appendChild(a);o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:X,millis:(new Date).getTime(),type:Bb});a.contentWindow.location.replace(t+L)}}
w[Cb]=function(){{var a=window.navigator.userAgent.toLowerCase();if(a.indexOf(Db)!=-1||(a.indexOf(Eb)!=-1||(a.indexOf(Fb)!=-1||(a.indexOf(Gb)!=-1||a.indexOf(Hb)!=-1)))){var b=document.location.href;if(b.indexOf(Ib)===0){return Jb}}return Kb}};v[Cb]={no:0,yes:1};cm3.onScriptLoad=function(){if(I){r=true;C()}};cm3.onInjectionDone=function(){q=true;o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:Lb,millis:(new Date).getTime(),type:Y});C()};E();D();var K;var L;if(B()){if(m.external&&(m.external.initModule&&m.external.initModule(Q))){m.location.reload();return}L=Mb;K=P}o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:S,millis:(new Date).getTime(),type:Nb});if(!B()){try{G([Kb],Ob);G([Jb],Pb);K=x[H(Cb)];var M=K.indexOf(Qb);if(M!=-1){y=Number(K.substring(M+1));K=K.substring(0,M)}L=K+Rb}catch(a){return}}var N;function O(){if(!s){s=true;if(!__gwt_stylesLoaded[Sb]){var a=n.createElement(Tb);__gwt_stylesLoaded[Sb]=a;a.setAttribute(Ub,Vb);a.setAttribute(Wb,t+Sb);n.getElementsByTagName(Xb)[0].appendChild(a)}if(!__gwt_stylesLoaded[Yb]){var a=n.createElement(Tb);__gwt_stylesLoaded[Yb]=a;a.setAttribute(Ub,Vb);a.setAttribute(Wb,t+Yb);n.getElementsByTagName(Xb)[0].appendChild(a)}C();if(n.removeEventListener){n.removeEventListener(Zb,O,false)}if(N){clearInterval(N)}}}
if(n.addEventListener){n.addEventListener(Zb,function(){J();O()},false)}var N=setInterval(function(){if(/loaded|complete/.test(n.readyState)){J();O()}},50);o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:S,millis:(new Date).getTime(),type:Y});o&&o({moduleName:Q,sessionId:p,subSystem:R,evtGroup:Lb,millis:(new Date).getTime(),type:T});n.write($b)}
cm3();