var CMUtils={getSummary:function(a){return $(a).find("div.summary").text()},isElementInViewport:function(b){var c=b.offsetTop,a=b.offsetHeight;while(b.offsetParent){b=b.offsetParent;c+=b.offsetTop}return(c>=window.pageYOffset&&(c+a)<=(window.pageYOffset+window.innerHeight))}};function Scroll(a,b){this.enabled=a;this.timeout=b}function ScrollManager(){var c=null,b=true,a=this;a.delay=500;a.onScrollStart=function(f){};a.onScrollStop=function(f){};a.disable=function(){b=false};a.enable=function(){b=true};var e=function(){var f=b;if(c===null){console.log("ScrollManager::onScrollStart(): scrolling started (enabled = "+f+")");a.onScrollStart(f);c=new Scroll(f,setTimeout(d,a.delay))}else{clearTimeout(c.timeout);c.timeout=setTimeout(d,a.delay)}},d=function(g){var f=c.enabled;console.log("ScrollManager::onScrollStop() (enabled = "+f+")");clearTimeout(c.timeout);c.timeout=null;c=null;a.onScrollStop(f)};$(window).scroll(e)};function PageElement(e,b,d){if(!e||!b||d===undefined){throw new TypeError("You must pass an element, element ID, and match index!")}var c=e,a=b,f=d;this.getElement=function(){return c};this.getId=function(){return a};this.getIndex=function(){return f};this.toString=function(){return a+" ("+f+")"}}function PageTracker(a,g){if(!a||!g){throw new TypeError("You must pass an Amplify storage class and an element match criteria!")}var b=a,e=g,d=[],i=this;i.getScrolledId=function(j){console.log("PageTracker::getScrolledId("+j+")");if(!j){throw new TypeError("You must specify a page!")}return h()[j]};i.setScrolledId=function(k,l){console.log("PageTracker::setScrolledId("+k+", "+l+")");if(!k){throw new TypeError("You must specify a page!")}var j=h();j[k]=l;f(j);return l};i._getElement=function(j){return $(j)};i.getElement=function(j){i._memoize=i._memoize||{};return(j in i._memoize)?i._memoize[j]:i._memoize[j]=i._getElement(j)};i.getTopElement=function(k){var j=c(k);if(j){return j}return null};i.getHeader=function(){return i.getElement("#header")};i.getContainer=function(){return i.getElement("#content")};var h=function(){var j=b.store("page_store_cache");if(!j){j={}}return j},f=function(j){b.store("page_store_cache",j)},c=function(k){var n=i.getScrolledId(k),l=i.getElement("#"+k),j=null,m=null;l.find(e).each(function(o,p){m=$(p).attr("id");if(m==n){j=new PageElement(p,m,o);console.log("PageTracker::getElementForPageId("+k+"): matched "+j.toString());return false}return true});return j}};function PageNavigator(a,c,d,f){if(!a||!c||!d||!f){throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!")}var b=a,g=c,h=d,e=f,i=this;i.getCurrentPage=function(){var j=b.store("current_page");console.log("PageNavigator::getCurrentPage(): current_page = "+j);if(!j||j=="login"){j=h;a.store("current_page",j)}return j};i.findTopVisibleElement=function(){console.log("PageNavigator::findTopVisibleElement()");var j=null,k=i.getCurrentPage(),l=null;c.getElement("#"+k).find(e).each(function(n,o){if(CMUtils.isElementInViewport(o)){l=$(o).attr("id");if(l){var m=CMUtils.getSummary(o);console.log("PageNavigator::findTopVisibleElement(): first visible element on "+k+": "+m+" ("+l+")");g.setScrolledId(k,l);j=o;return false}}return true});return j}};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length>>>0,c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}}function TemplateLoader(e){var a=this,g=e||[],f={},c={},b=function(j){var i=0,h;for(h in j){if(j.hasOwnProperty(h)){i++}}return i},d=function(){var i=b(c),h=b(f);if((i+h)>=g.length){a.onFinished()}};f_onLoad=function(h,i){console.log("TemplateLoader::f_onLoad("+h+", <template>)");c[h]=i;a.onLoad(h,i);d()},f_onFail=function(h,j,i){console.log("TemplateLoader::f_onFail("+h+", "+j+")");f[h]=i;a.onFail(h);d()},f_loadTemplate=function(h){console.log("TemplateLoader::f_loadTemplate("+h+")");(function(){if(h.indexOf("#")==0){console.log("TemplateLoader::f_loadTemplate: id-based url");var k=h.replace(/([^0-9A-Za-z\#])/g,"\\$1");f_onLoad(h,$(k).html())}else{console.log("TemplateLoader::f_loadTemplate: standard url");var j=function(l){f_onLoad(h,l)},i=function(l,n,m){f_onFail(h,n,m)};$.ajax({url:h,cache:false,success:j,error:i,dataType:"text"})}})()};a.add=function(h){g.push(h)};a.remove=function(h){g.splice(g.indexOf(h),1);delete c[h];delete f[h]};a.clear=function(){g=[];c={};f={}};a.urls=function(){return g.slice(0)};a.getTemplate=function(h){return c[h]};a.renderTemplate=function(h,j){if(!j){j={}}var i=c[h];return Mustache.to_html(i,j)};a.load=function(){console.log("TemplateLoader::load()");var i,h;for(i in g){h=g[i];console.log("TemplateLoader::load(): loading "+h);f_loadTemplate(h)}};a.onLoad=function(h){};a.onFail=function(h){};a.onFinished=function(){}};var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],months=["January","February","March","April","May","June","July","August","September","October","November","December"];function formatTime(e,c){var a,b;a=String("0"+(e.getHours()%12)).slice(-2);if(a=="00"){a="12"}b=a+":"+String("0"+e.getMinutes()).slice(-2);if(c===true){b+=":"+String("0"+e.getSeconds()).slice(-2)}if((e.getHours()%12)==e.getHours()){b+="am"}else{b+="pm"}return b}function formatDate(a){return days[a.getDay()]+", "+months[a.getMonth()]+" "+a.getDate()}function getDateFromString(d){if(d instanceof Date){return new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),0,0)}var b=d.split("T"),a=b[0].split("-"),c=b[1].split(":");return new Date(a[0],a[1]-1,a[2],c[0],c[1],0,0)}function padNumber(a){return(String("0"+a).slice(-2))}function getStringFromDate(a){return a.getFullYear()+"-"+padNumber(a.getMonth()+1)+"-"+padNumber(a.getDate())+"T"+padNumber(a.getHours())+":"+padNumber(a.getMinutes())+":"+padNumber(a.getSeconds())+"-00:00"};console.log("app.js loading");var eventsModel;ko.bindingHandlers.dateString={update:function(b,c,h,a){var f=c(),e=h();var g=ko.utils.unwrapObservable(f);var d=e.datePattern||"MM/dd/yyyy hh:mm:ss";$(b).text(g.toString(d))}};function Event(b){var a=this;a.id=ko.observable(b["@id"]);a.cleanId=ko.observable(b["@id"].replace(/[\W\@]+/g,""));a.summary=ko.observable(b.summary);a.description=ko.observable(b.description);a.start=ko.observable(new Date(b.start));a.end=ko.observable(new Date(b.end));a.location=ko.observable(b.location);a.createdBy=ko.observable(b["created-by"]);a.owner=ko.observable(b.owner);a.timespan=ko.computed(function(){var e=e===null?null:formatTime(a.start(),false);var c=c===null?null:formatTime(a.end(),false);var d="";if(e!=null){d+=e;if(c!=null){d+="-"+c}}return d},a);a.favorite=ko.observable(false);a.favorite.subscribe(function(d){if(eventsModel.updating()){return}console.log(a.id()+" favorite has changed to: "+d);var c="PUT";if(d){c="PUT"}else{c="DELETE"}$.ajax({url:serverModel.cruisemonkey()+"/rest/favorites?event="+encodeURI(a.id()),dataType:"json",type:c,cache:false,username:serverModel.username(),password:serverModel.password()})})}var matchEventText=function(b,a){if(b.summary().toLowerCase().search(a)!=-1){return true}else{if(b.description().toLowerCase().search(a)!=-1){return true}else{return false}}};var onFilterChange=function(){};function ServerModel(){var a=this;a.cruisemonkey=ko.observable(amplify.store("cruisemonkey_url"));a.username=ko.observable(amplify.store("username"));a.password=ko.observable(amplify.store("password"));a.reset=function(){a.cruisemonkey(amplify.store("cruisemonkey_url"));a.username(amplify.store("username"));a.password(amplify.store("password"))};a.persist=function(){amplify.store("cruisemonkey_url",a.cruisemonkey());amplify.store("username",a.username());amplify.store("password",a.password())};if(!a.cruisemonkey()){a.cruisemonkey(document.URL.host)}}var serverModel=new ServerModel();function EventsViewModel(){var a=this;a.events=ko.observableArray();a.updating=ko.observable(false);a.updateData=function(d){a.updating(true);var b=[],e=[],c=[];if(d.favorites&&d.favorites.favorite){if(d.favorites.favorite instanceof Array){e=d.favorites.favorite}else{e.push(d.favorites.favorite)}b=$.map(e,function(g){return g["@event"]})}if(d.events&&d.events.event){if(d.events.event instanceof Array){c=d.events.event}else{c.push(d.events.event)}var f=$.map(c,function(j){var m=(b.indexOf(j["@id"])!=-1);var i=ko.utils.arrayFirst(a.events(),function(n){if(n){if(n.id()==j["@id"]){return true}else{return false}}else{console.log("no entry")}});if(i){var g=new Date(j.start);var l=new Date(j.end);var h=j["created-by"];i.favorite(m);if(i.summary()!=j.summary){i.summary(j.summary)}if(i.description()!=j.description){i.description(j.description)}if(i.start().getTime()!=g.getTime()){i.start(g)}if(i.end().getTime()!=l.getTime()){i.end(l)}if(i.createdBy()!=h){i.createdBy(h)}if(i.owner()!=j.owner){i.owner(j.owner)}return i}else{var k=new Event(j);k.favorite(m);return k}});a.events(f)}amplify.store("events",d);a.updating(false)};a.updateDataFromJSON=function(){$.ajax({url:serverModel.cruisemonkey()+"/rest/cruisemonkey/events",dataType:"json",cache:false,username:serverModel.username(),password:serverModel.password(),success:a.updateData})};a.updateDataFromJSON()}eventsModel=new EventsViewModel();if(typeof(Storage)!=="undefined"){var restEvents=amplify.store("events");if(restEvents){console.log("loading stored ReST events");eventsModel.updateData(restEvents)}else{console.log("no stored ReST events")}}function OfficialEventsModel(){var a=this;a.filter=ko.observable("");a.events=eventsModel.events}var officialEventsModel=new OfficialEventsModel();officialEventsModel.filter.subscribe(onFilterChange,officialEventsModel);officialEventsModel.filteredEvents=ko.dependentObservable(function(){var b=this,c=b.filter().toLowerCase(),d=serverModel.username();var a=ko.utils.arrayFilter(b.events(),function(e){if(e.owner()=="google"){return true}return false});if(!c){return a}else{return ko.utils.arrayFilter(a,function(e){return matchEventText(e,c)})}},officialEventsModel);function MyEventsModel(){var a=this;a.filter=ko.observable("");a.events=eventsModel.events}var myEventsModel=new MyEventsModel();myEventsModel.filter.subscribe(onFilterChange,myEventsModel);myEventsModel.filteredEvents=ko.dependentObservable(function(){var b=this,c=b.filter().toLowerCase(),a=ko.utils.arrayFilter(b.events(),function(d){if(d.favorite()){return true}if(d.owner()!="google"){return true}return false});if(!c){return a}else{return ko.utils.arrayFilter(a,function(d){return matchEventText(d,c)})}},myEventsModel);var navModel={signedIn:ko.observable(false)};navModel.notSignedIn=ko.dependentObservable(function(){var a=this;return !a.signedIn()},navModel);console.log("app.js loaded");console.log("init.js loading");var pages={},page_scroll_element=[],online=false,m_interval,_header,_container;var scrollManager=new ScrollManager();scrollManager.delay=100;scrollManager.onScrollStop=function(a){if(a){var b=pageNavigator.findTopVisibleElement();if(b){console.log("visible element: "+CMUtils.getSummary(b)+" ("+$(b).attr("id")+")")}else{console.log("no elements visible!")}}else{console.log("scrolling stopped while disabled")}};var templates=["#header.html","#events.html","#login.html"],templateLoader=new TemplateLoader(templates);templateLoader.onFinished=function(){createLoginView();createOfficialEventsView();createMyEventsView();setupDefaultView()};var pageTracker=new PageTracker(amplify,".scrollable"),pageNavigator=new PageNavigator(amplify,pageTracker,"official-events",".calendar-event"),setOffline=function(){console.log("setOffline()");if(online==true){console.log("setOffline: we were online but have gone offline")}online=false;navModel.signedIn(false);console.log("online = "+online)},setOnline=function(){console.log("setOnline()");if(online==false){console.log("setOnline: we were offline but have gone online")}online=true;navModel.signedIn(true);console.log("online = "+online)},isOnline=function(){return online},isSignedIn=function(){return online&&loginModel.username()&&loginModel.username().length>0},setupHeader=function(){console.log("setupHeader()");header=pageTracker.getHeader();header.html(templateLoader.renderTemplate("#header.html"));var a=$(header).find("nav")[0];$(a).find("a").each(function(b,c){var d=undefined;if(c.href!==undefined){d=c.href.split("#")[1]}if(d!==undefined&&d!=""){$(c).on("click.fndtn touchstart.fndtn",function(f){f.preventDefault();console.log("navigation event: "+d);navigateTo(d);if($(".top-bar").hasClass("expanded")){$(".toggle-topbar").find("a").click()}})}});$(document).foundationTopBar();$(a).find(".signin").each(function(b,c){$(c).on("click.fndtn touchstart.fndtn",function(d){d.preventDefault();setOffline();navigateTo("login");if($(".top-bar").hasClass("expanded")){$(".toggle-topbar").find("a").click()}})});$(a).find(".signout").each(function(b,c){$(c).on("click.fndtn touchstart.fndtn",function(d){d.preventDefault();setOffline();serverModel.username(null);serverModel.password(null);navigateTo("login");if($(".top-bar").hasClass("expanded")){$(".toggle-topbar").find("a").click()}})});ko.applyBindings(navModel,a)},navigateTo=function(a){console.log("----------------------------------------------------------------------------------");console.log("navigateTo("+a+")");scrollManager.disable();if(a=="official-events"){showOfficialEventsView()}else{if(a=="my-events"){showMyEventsView()}else{if(a=="login"){showLoginView()}else{console.log("unknown page ID: "+a);return false}}}var b=pageTracker.getTopElement(a);if(!b||b.getIndex()==0){console.log("scrolling to the top of the page");setTimeout(function(){pageTracker.getElement("body").scrollTo(0,0,{onAfter:function(){setTimeout(function(){scrollManager.enable()},50)}})},0)}else{console.log("scrolling to "+b.toString());setTimeout(function(){pageTracker.getElement("body").scrollTo("#"+b.getId(),0,{margin:false,offset:{left:0,top:-45},onAfter:function(){setTimeout(function(){scrollManager.enable()},50)}})},0)}return true},checkIfAuthorized=function(c,b){console.log("checkIfAuthorized()");var d=serverModel.username();var a=serverModel.password();if(!d||!a){b();return}$.ajax({url:serverModel.cruisemonkey()+"/rest/auth",dataType:"json",cache:false,type:"GET",username:d,password:a,success:function(e){if(e==true){setOnline();console.log("test returned OK");c();return}else{setOnline();console.log("success function called, but data was not OK!");b();return}}}).error(function(e){if(e&&e.readyState==0){setOffline()}else{setOnline()}console.log("An error occurred: "+ko.toJSON(e));b()})},showLoginOrCurrent=function(){var a=pageNavigator.getCurrentPage();checkIfAuthorized(function(){console.log("checkIfAuthorized: success");navigateTo(a)},function(){console.log("checkIfAuthorized: failure");navigateTo("login")})},setupDefaultView=function(){console.log("setupDefaultView()");setupHeader();m_interval=setInterval(function(){eventsModel.updateDataFromJSON()},60000);showLoginOrCurrent()},replaceCurrentPage=function(a){console.log("replaceCurrentPage("+a+")");var c=pageTracker.getElement("#"+a);var b=c.find("input[type=search]").first();pageTracker.getContainer().children().css("display","none");c.css("display","block");if(!Modernizr.touch){if(b){b.focus()}}if(a!="login"){amplify.store("current_page",a)}return pageTracker.getContainer()[0]},createOfficialEventsView=function(){console.log("createOfficialEventsView()");if(!pages.official){var b=templateLoader.renderTemplate("#events.html",{eventType:"official"});var c=document.createElement("div");c.setAttribute("id","official-events");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);pages.official=c;ko.applyBindings(officialEventsModel,a)}},showOfficialEventsView=function(){console.log("showOfficialEventsView()");createOfficialEventsView();var a=replaceCurrentPage("official-events");$(a).find("ul.event-list").css("display","block")},createMyEventsView=function(){console.log("createMyEventsView()");if(!pages.my){var b=templateLoader.renderTemplate("#events.html",{eventType:"my"});var c=document.createElement("div");c.setAttribute("id","my-events");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);pages.my=c;ko.applyBindings(myEventsModel,a)}},showMyEventsView=function(){console.log("showMyEventsView()");createMyEventsView();var a=replaceCurrentPage("my-events");$(a).find("ul.event-list").css("display","block")},createLoginView=function(){console.log("createLoginView()");if(!pages.login){var b=templateLoader.renderTemplate("#login.html");var c=document.createElement("div");c.setAttribute("id","login");$(c).css("display","none");$(c).html(b);$(c).find("#login_reset").on("click.fndtn touchstart.fndtn",function(d){d.preventDefault();console.log("cancel clicked");serverModel.reset()});$(c).find("#login_save").on("click.fndtn touchstart.fndtn",function(d){d.preventDefault();console.log("save clicked");serverModel.persist();showLoginOrCurrent();if(eventsViewModel){eventsViewModel.updateDataFromJSON()}});var a=pageTracker.getContainer()[0].appendChild(c);console.log("done creating loginView");pages.login=c;ko.applyBindings(serverModel,a)}},showLoginView=function(){console.log("showLoginView()");createLoginView();var a=replaceCurrentPage("login")};console.log("init.js loaded");