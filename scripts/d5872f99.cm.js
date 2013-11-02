!function(){"use strict";"function"!=typeof String.prototype.capitalize&&(String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1).toLowerCase()}),"function"!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(a){return 0===this.lastIndexOf(a,0)}),"function"!=typeof String.prototype.endsWith&&(String.prototype.endsWith=function(a){return-1!==this.indexOf(a,this.length-a.length)})}(),function(){"use strict";angular.module("cruisemonkey.Config",[]).value("config.logging.useStringAppender",!1).value("config.database.host","cm.raccoonfink.com").value("config.database.name","cruisemonkey").value("config.database.replicate",!0).value("config.app.version","3.90")}(),function(){"use strict";angular.module("cruisemonkey.controllers.About",["cruisemonkey.Database","cruisemonkey.Logging","cruisemonkey.Config"]).controller("CMAboutCtrl",["$scope","$rootScope","LoggingService","config.app.version",function(a,b,c,d){c.info("Initializing CMAboutCtrl"),b.title="About CruiseMonkey "+d}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Advanced",["cruisemonkey.Logging","cruisemonkey.Config"]).controller("CMAdvancedCtrl",["$scope","$rootScope","Database","LoggingService","config.app.version",function(a,b,c,d){d.info("Initializing CMAdvancedCtrl"),b.title="Break CruiseMonkey!",a.resetDatabase=function(){c.reset()}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.DeckList",["ngRoute","cruisemonkey.Logging","hammer"]).controller("CMDeckListCtrl",["$scope","$rootScope","$routeParams","$location","LoggingService",function(a,b,c,d,e){e.info("Initializing CMDeckListCtrl"),a.deck=parseInt(c.deck,10),b.title="Deck "+a.deck,a.previous=function(){f()},a.next=function(){g()};var f=function(){a.safeApply(function(){if(2!==a.deck){var b=a.deck-1;e.info("previous() going down to deck "+b),d.path("/deck-plans/"+b)}})},g=function(){a.safeApply(function(){if(15!==a.deck){var b=a.deck+1;e.info("next() going up to deck "+b),d.path("/deck-plans/"+b)}})},h=function(a){return console.log("received event: ",a),37===a.keyCode?(f(),!1):39===a.keyCode?(g(),!1):!0};b.actions=[],2!==a.deck&&b.actions.push({name:"Previous",iconClass:"arrow-left4",launch:function(){f()}}),15===a.deck?b.actions.push({name:"Blank",iconClass:"blank",launch:function(){}}):b.actions.push({name:"Next",iconClass:"arrow-right4",launch:function(){g()}}),document.addEventListener("keydown",h,!0),a.$on("$destroy",function(){document.removeEventListener("keydown",h,!0)})}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Events",["ngRoute","cruisemonkey.User","cruisemonkey.Events","cruisemonkey.Logging","ui.bootstrap.modal"]).filter("orderByEvent",function(){return function(a){if(!angular.isObject(a))return a;var b=[];for(var c in a){var d=a[c];d.isNewDay=!1,b.push(d)}var e,f;b.sort(function(a,b){return e=a.start,f=b.start,e.isBefore(f)?-1:e.isAfter(f)?1:(e=a.summary.toLowerCase(),f=b.summary.toLowerCase(),e>f?1:f>e?-1:(e=a.end,f=b.end,e.isBefore(f)?-1:e.isAfter(f)?1:0))});var g,h;angular.forEach(b,function(a,b){a.isNewDay=!1,h=a.start,0===b?a.isNewDay=!0:h.isAfter(g,"day")&&(a.isNewDay=!0),g=h});for(var i=0;i<b.length;i++)0===i&&(b[i].isNewDay=!0);return b}}).controller("CMEditEventCtrl",["$q","$scope","$rootScope","$modal","UserService","LoggingService",function(a,b,c,d,e,f){f.info("Initializing CMEditEventCtrl");var g="YYYY-MM-DD HH:mm";if(Modernizr.inputtypes["datetime-local"]&&(g="YYYY-MM-DDTHH:mm"),c.editEvent)b.event=angular.copy(c.editEvent),delete c.editEvent,b.event.start=b.event.start.format(g),b.event.end=b.event.end.format(g),f.info("Found existing event to edit."),console.log(b.event);else{var h=moment();b.event={start:h.format(g),end:h.add("hours",1).format(g),type:"event",username:e.getUsername(),isPublic:!0},f.info("Created fresh event."),console.log(b.event)}}]).controller("CMEventCtrl",["$scope","$rootScope","$timeout","$routeParams","$location","$q","$modal","$templateCache","UserService","EventService","LoggingService",function(a,b,c,d,e,f,g,h,i,j,k){k.info("Initializing CMEventCtrl"),b.eventType=d.eventType,b.title=d.eventType.capitalize()+" Events",j.init(),a.prettyDate=function(a){return a?a.format("dddd, MMMM Do"):void 0},a.fuzzy=function(a){return a?a.fromNow():void 0},a.justTime=function(a){return a?a.format("hh:mma"):void 0},a.trash=function(b){a.safeApply(function(){f.all([j.removeEvent(b),a.events]).then(function(a){var b=a[0],c=a[1];console.log("removed = ",b),delete c[b.id]})})},a.edit=function(c){a.safeApply(function(){console.log("edit: ",c),b.editEvent=c;var d=g.open({templateUrl:"edit-event.html",controller:"CMEditEventCtrl"});d.result.then(function(b){k.info("Save finished!"),console.log(b),f.all([j.updateEvent(b),a.events]).then(function(a){var c=a[1];b.start=moment(b.start),b.end=moment(b.end),c[b._id]=b,k.info("Finished updating event.")})},function(){k.warn("Add canceled!")})})},a.onFavoriteChanged=function(a,b){b?j.addFavorite(a):j.removeFavorite(a)},a.onPublicChanged=function(b,c){console.log("onPublicChanged: ",b,c),b.isPublic=c,f.when(a.events).then(function(a){a[b._id].isPublic=c,j.updateEvent(a[b._id])})},b.actions=[],i.getUsername()&&""!==i.getUsername()&&b.actions.push({name:"Add Event",iconClass:"add",launch:function(){k.info("launching modal");var b=g.open({templateUrl:"edit-event.html",controller:"CMEditEventCtrl"});b.result.then(function(b){k.info("Save finished!"),console.log(b),f.all([j.addEvent(b),a.events]).then(function(a){var b=a[0],c=a[1];b.start=moment(b.start),b.end=moment(b.end),c[b._id]=b})},function(){k.warn("Add canceled!")})}})}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Header",["cruisemonkey.Logging"]).controller("CMHeaderCtrl",["$scope","$rootScope","$location","LoggingService",function(a,b,c,d){d.info("Initializing CMHeaderCtrl")}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Login",["cruisemonkey.Logging","cruisemonkey.User"]).controller("CMLoginCtrl",["$scope","$rootScope","$location","UserService","LoggingService",function(a,b,c,d,e){e.info("Initializing CMLoginCtrl"),b.title="Log In",b.user=d.get(),a.isUnchanged=function(a){var b=d.get();return null===b||void 0===b?null===a||void 0===a?!0:!1:b.username===a.username&&b.password===a.password},a.reset=function(){var a=d.get();e.info("resetting user: ",a),b.user=a,b.$broadcast("cm.loggedOut"),c.path("/events/official")},a.update=function(a){return"official"===a.username?(console.log('Attempt to log in as "official", skipping.'),c.path("/events/official"),void 0):(a.loggedIn=!0,e.info("saving user"),console.log(a),d.save(a),b.user=d.get(),b.$broadcast("cm.loggedIn"),c.path("/events/my"),void 0)}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Logout",["cruisemonkey.Logging","cruisemonkey.User"]).controller("CMLogoutCtrl",["$scope","$rootScope","$routeParams","$location","UserService","LoggingService",function(a,b,c,d,e,f){f.info("Initializing CMLogoutCtrl"),b.title="Logging Out",b.user=e.reset(),d.replace(),d.path("/events/official")}])}(),function(){"use strict";angular.module("cruisemonkey.Navigation",["cruisemonkey.Logging"]).controller("CMNavigationCtrl",["$rootScope","$scope","$location","$document","UserService","LoggingService","$mobileFrame",function(a,b,c,d,e,f,g){f.info("Initializing CMNavigationCtrl"),b.toggleDrawer=function(){return g.navVisible()&&g.toggleNav(),!0}}])}(),function(){"use strict";angular.module("cruisemonkey.Database",["cruisemonkey.Logging","cruisemonkey.Config","ngInterval","angularLocalStorage"]).factory("Database",["$location","$interval","$timeout","$rootScope","$window","LoggingService","storage","config.database.host","config.database.name","config.database.replicate",function(a,b,c,d,e,f,g,h,i,j){f.info("Initializing CruiseMonkey database: "+i),g.bind(d,"_seq",{defaultValue:0,storeName:"cm.db.sync"}),console.log("last sequence: "+d._seq),h||(h=a.host());var k="http://"+h+":5984/cruisemonkey",l=null,m=null,n=!1,o=function(){l=new Pouch(i),m=null,n=!1,l.compact()},p=function(){if(!n){n=!0,f.info("Watching for document changes.");var a=d._seq;a||(a=0),l.changes({since:a,onChange:function(a){console.log("change: ",a),a.seq&&(d._seq=a.seq),a.deleted?d.$broadcast("cm.documentDeleted",a):d.$broadcast("cm.documentUpdated",a.doc)},continuous:!0,include_docs:!0})}},q=function(){f.info("Attempting to replicate with "+k),l.replicate.to(k,{complete:function(){l.replicate.from(k,{complete:function(){p()}})}})},r=function(){return j?null!==m?(f.warn("Replication has already been started!  Timeout ID = "+m),!1):(f.info("Enabling replication with "+k),m=b(function(){q()},1e4),q(),!0):(f.warn("startReplication() called, but replication is not enabled!"),p(),!1)},s=function(){return j?null!==m?(f.info("Stopping replication with "+k),b.cancel(m),m=null,!0):(f.info("Replication is already stopped!"),!1):(f.warn("stopReplication() called, but replication is not enabled!"),void 0)},t=function(a){void 0!==navigator.connection.type?(console.log("Connection type is: "+navigator.connection.type),navigator.connection.type===Connection.NONE?s():r()):void 0!==navigator.connection.bandwidth?(console.log("Connection bandwidth is: "+navigator.connection.bandwidth),navigator.connection.bandwidth>0?r():s()):(f.info("Got a connection type event."),console.log(a))},u=function(){c(function(){navigator&&navigator.connection?navigator.connection.addEventListener?(f.info("Browser has native navigator.connection support."),navigator.connection.addEventListener("change",t,!1),t()):(f.info("Browser does not have native navigator.connection support.  Trying with phonegap."),document.addEventListener("online",t,!1),document.addEventListener("offline",t,!1),t()):(f.warn("Unsure how to handle connection management; starting replication and hoping for the best."),r()),d.$broadcast("cm.databaseReady")},10)},v=function(){s(),navigator&&navigator.connection&&navigator.connection.removeEventListener?navigator.connection.removeEventListener("change",t,!1):(document.removeEventListener("online",t,!1),document.removeEventListener("offline",t,!1))},w=function(){d.safeApply(function(){v(),n=!1,Pouch.destroy(i,function(a){a?e.alert("Failed to destroy existing database!"):(f.info("Reloading CruiseMonkey."),document.location="index.html")})})};return o(),u(),f.info("Finished initializing CruiseMonkey database."),{reset:w,database:l,startReplication:r,stopReplication:s}}])}(),function(){"use strict";angular.module("cruisemonkey.Events",["cruisemonkey.Database","cruisemonkey.User","cruisemonkey.Logging"]).factory("EventService",["$q","$rootScope","$timeout","Database","UserService","LoggingService",function(a,b,c,d,e,f){f.info("Initializing EventService.");var g=function(a){return null===a||void 0===a?void 0:moment(a).format("YYYY-MM-DD HH:mm")},h={},i={},j=[],k=function(a){return a.start&&(a.start=moment(a.start)),a.end&&(a.end=moment(a.end)),a},l=function(a){var b,c={};for(b=0;b<a.length;b++){var d=a[b];d?(d.hasOwnProperty("isFavorite")||(d.isFavorite=!1),d.hasOwnProperty("_favoriteId")&&(h[d._favoriteId]=d._id),c[d._id]=d):(console.log("events = ",a),console.log("event "+b+" was undefined!"))}return c},m=function(){if(f.info("Events.updateEventCache(): eventType = "+b.eventType),!i[b.eventType])return f.info("no processed events for type "+b.eventType),void 0;b.events||(b.events={});var a=i[b.eventType];angular.forEach(a,function(a,c){b.events[c]=a}),angular.forEach(b.events,function(c,d){a[d]||delete b.events[d]}),b.$broadcast("cm.eventCacheUpdated")},n=function(){var b=a.defer();return a.when(A()).then(function(a){i.official=l(a),b.resolve(i.official),m()},function(a){b.reject(a)}),b.promise},o=function(){var b=a.defer();return a.when(B()).then(function(a){i.unofficial=l(a),b.resolve(i.unofficial),m()},function(a){b.reject(a)}),b.promise},p=function(){var b=a.defer();return a.when(D()).then(function(a){i.my=l(a),b.resolve(i.my),m()},function(a){b.reject(a)}),b.promise},q=function(){var a=[n,o,p];"unofficial"===b.eventType?a=[o,n,p]:"my"===b.eventType&&(a=[p,n,o]);var d=a[0]();return c(function(){a[1](),a[2]()},0),d},r=function(b){f.info("Events.updateDocument("+b._id+")");var c=b._id;if("favorite"===b.type)return f.info("document "+c+" is a favorite"),h[c]=b.eventId,a.when(y(b.eventId)).then(function(a){a._favoriteId=c,a.isFavorite=!0,r(a)}),void 0;if("official"===b.username){if(b.isPublic=!0,b.isFavorite||(b.isFavorite=!1),i.official){var d=i.official[c];d&&(b.isFavorite=d.isFavorite)}f.debug("Events.updateDocument(): putting "+c+" in official events."),i.official[c]=b}if(b.isPublic&&"official"!==b.username){if(b.isFavorite||(b.isFavorite=!1),i.unofficial){var g=i.unofficial[c];g&&(b.isFavorite=g.isFavorite)}f.debug("Events.updateDocument(): putting "+c+" in unofficial events."),i.unofficial[c]=b}var j;i.my&&(j=i.my[c]),(b.username===e.getUsername()||b.isFavorite||j&&j.isFavorite)&&(j&&(b.isFavorite=j.isFavorite),f.debug("Events.updateDocument(): putting "+c+" in my events."),i.my[c]=b),m()},s=function(a){f.info("Events.deleteDocument("+a.id+")");var b=a.id;return h[b]?(f.info(b+" was a favorite.  Updating the associated event ("+h[b]+")"),a.isFavorite=!1,b=h[b],i.official[b]&&(i.official[b].isFavorite=!1),i.unofficial[b]&&(i.unofficial[b].isFavorite=!1),i.my[b]&&delete i.my[b],q(),void 0):(angular.forEach(i,function(a,c){a[b]&&(f.debug("event["+b+"] was found in type "+c+", deleting."),delete a[b])}),void 0)},t=function(c,e){var g=a.defer();return d.database.query({map:c},e,function(a,c){b.$apply(function(){if(a)f.error(a),g.reject(a);else{var b,d=[];for(b=0;b<c.total_rows;b++)d.push(k(c.rows[b].value));g.resolve(d)}})}),g.promise},u=function(c){var d=a.defer();return setTimeout(function(){b.$apply(function(){d.resolve(c)})},0),d.promise},v=function(c){var e=angular.copy(c);e.type="event",e.start=g(e.start),e.end=g(e.end);var h=a.defer();return e.username&&""!==e.username?(f.info('addEvent(): posting event "'+e.summary+'" for user "'+e.username+'"'),d.database.post(e,function(a,c){b.$apply(function(){a?(f.error(a),h.reject(a)):(e._id=c.id,e._rev=c.rev,h.resolve(e))})})):(f.info("addEvent(): no username in the event!"),h.reject("no username specified")),h.promise},w=function(c){var e=a.defer();if(!c._rev||!c._id)return f.warn("Attempting to update event "+c.summary+", but it is missing _rev or _id!"),e.reject("bad event"),e.promise;var h=angular.copy(c);delete h.isFavorite,delete h._favoriteId,h.start=g(h.start),h.end=g(h.end),d.database.put(h,function(a,c){b.$apply(function(){a?(f.error(a),e.reject(a)):(h._rev=c.rev,e.resolve(h))})})},x=function(c){f.info("removeEvent("+c._id+")");var e=a.defer();return d.database.remove(c,function(a,c){b.$apply(function(){a?(f.error(a),e.reject(a)):e.resolve(c)})}),e.promise},y=function(c){var e=a.defer();return d.database.get(c,function(a,c){b.$apply(function(){a?(f.error(a),e.reject(a)):e.resolve(k(c))})}),e.promise},z=function(){return f.info("getAllEvents()"),t(function(a){"event"===a.type&&emit(a.username,a)},{reduce:!1})},A=function(){return f.info("getOfficialEvents()"),t(function(a){"event"===a.type&&emit(a.username,a)},{reduce:!0,key:"official"})},B=function(){return f.info("getUnofficialEvents()"),t(function(a){"event"===a.type&&a.isPublic&&"official"!==a.username&&emit(a.username,a)},{reduce:!0})},C=function(){f.info("getUserEvents()");var a=e.getUsername();return a?t(function(a){"event"===a.type&&emit(a.username,a)},{reduce:!1,key:a}):(f.warn("getUserEvent(): user not logged in"),u([]))},D=function(){f.info("getMyEvents()");var c=e.getUsername();if(!c)return f.warn("getMyEvents(): user not logged in"),u([]);var g=a.defer();return d.database.query({map:function(a){"event"===a.type?emit(a.username,{_id:a._id,type:a.type}):"favorite"===a.type&&emit(a.username,{_id:a.eventId,type:a.type})}},{reduce:!0,include_docs:!0,key:c},function(a,c){b.$apply(function(){if(a)f.error(a),g.reject(a);else{var b,d,e=[];for(b=0;b<c.total_rows;b++)d=c.rows[b],d.doc&&("favorite"===d.value.type?(d.doc._favoriteId=d.value._id,d.doc.isFavorite=!0):d.doc=k(d.doc),e.push(d.doc));g.resolve(e)}})}),g.promise},E=function(){var c=e.getUsername();if(!c)return f.warn("getMyFavorites(): user not logged in"),u([]);var g=a.defer();return d.database.query({map:function(a){"favorite"===a.type&&emit(a.username,a.eventId)}},{reduce:!0,include_docs:!1,key:c},function(a,c){b.$apply(function(){if(a)f.error(a),g.reject(a);else{var b,d=[];for(b=0;b<c.total_rows;b++)d.push(k(c.rows[b].value));g.resolve(d)}})}),g.promise},F=function(c){var g=e.getUsername();if(!g||!c)return f.warn("isFavorite(): user not logged in, or no eventId passed"),u(!1);var h=a.defer();return d.database.query({map:function(a){"favorite"===a.type&&emit({username:a.username,eventId:a.eventId})}},{reduce:!0,include_docs:!1,key:{username:g,eventId:c}},function(a,c){b.$apply(function(){a?(f.error(a),h.reject(a)):h.resolve(c.total_rows>0)})}),h.promise},G=function(c){var g=e.getUsername();if(!g||!c)return f.warn("addFavorite(): user not logged in, or no eventId passed"),u(void 0);var i=a.defer();return d.database.post({type:"favorite",username:g,eventId:c},function(a,d){b.$apply(function(){a?(f.error(a),i.reject(a)):(h[d.id]=c,i.resolve(d.id))})}),i.promise},H=function(c){var g=e.getUsername();if(!g||!c)return f.warn("removeFavorite(): user not logged in, or no eventId passed"),u(void 0);var i=a.defer();return d.database.query({map:function(a){"favorite"===a.type&&emit({username:a.username,eventId:a.eventId},a._id)}},{reduce:!0,include_docs:!0,key:{username:g,eventId:c}},function(c,e){b.$apply(function(){if(c)f.error(c),i.reject(c);else if(e.total_rows>0){var g=[];angular.forEach(e.rows,function(c){var e=a.defer();g.push(e.promise);var i=c.value,j=c.doc;delete h[i],d.database.remove(j,function(a,c){b.$apply(function(){a?(f.error(a),e.reject(a)):e.resolve(c)})})}),a.all(g).then(function(){i.resolve(e.total_rows)},function(a){i.reject(a)})}else i.resolve(e.total_rows)})}),i.promise},I=function(a,b){f.trace("got event: ",a),f.trace("document: ",b),"cm.databaseReady"===a.name?q():"cm.documentUpdated"===a.name?r(b):"cm.documentDeleted"===a.name?(q(),s(b)):"cm.loggedIn"===a.name||"cm.loggedOut"===a.name?(f.info("User login changed.  Resetting cache."),i={},q()):f.warn("Unhandled event type: "+a.name)};return f.info("Initializing caches."),q().then(function(){angular.forEach(["cm.databaseReady","cm.documentDeleted","cm.documentUpdated","cm.loggedIn","cm.loggedOut"],function(a){j.push(b.$on(a,I))})}),b.$on("$destroy",function(){angular.forEach(j,function(a){a()})}),{init:m,addEvent:v,updateEvent:w,removeEvent:x,getEvent:y,getAllEvents:z,getOfficialEvents:A,getUnofficialEvents:B,getUserEvents:C,getMyEvents:D,getMyFavorites:E,isFavorite:F,addFavorite:G,removeFavorite:H}}])}(),function(){"use strict";function a(){}function b(){}a.prototype=new log4javascript.Appender,a.prototype.layout=new log4javascript.NullLayout,a.prototype.threshold=log4javascript.Level.DEBUG,a.prototype._saLogHistory="",a.prototype._saIndentLevel=0,a.prototype._getPrefix=function(){for(var a="",b=0;b<this._saIndentLevel;b++)a+=" ";return a},a.prototype._increaseIndentLevel=function(){this._saIndentLevel+=2},a.prototype._decreaseIndentLevel=function(){this._saIndentLevel-=2,this._saIndentLevel<0&&(this._saIndentLevel=0)},a.prototype._resetLogHistory=function(){this._saLogHistory="",this._saIndentLevel=0},a.prototype._addToLogHistory=function(a){void 0===this._saLogHistory?this._saLogHistory=this._getPrefix()+a+"\n":this._saLogHistory+=this._getPrefix()+a+"\n"},a.prototype.getLogHistory=function(){return this._saLogHistory||""},a.prototype.append=function(a){var b=this,c=function(){var c=b.getLayout(),d=c.format(a);return c.ignoresThrowable()&&a.exception&&(d+=a.getThrowableStrRep()),d};b._addToLogHistory(c())},a.prototype.group=function(a){this._addToLogHistory("=== "+a+" ==="),this._increaseIndentLevel()},a.prototype.groupEnd=function(){this._decreaseIndentLevel()},a.prototype.toString=function(){return"StringAppender"},b.prototype=new log4javascript.Appender,b.prototype.layout=new log4javascript.NullLayout,b.prototype.threshold=log4javascript.Level.DEBUG,b.prototype.append=function(a){var b=this,c=function(){var c=b.getLayout(),d=c.format(a);return c.ignoresThrowable()&&a.exception&&(d+=a.getThrowableStrRep()),d};console.log(c())},b.prototype.group=function(a){console.group&&console.group(a)},b.prototype.groupEnd=function(){console.groupEnd&&console.groupEnd()},b.prototype.toString=function(){return"ConsoleAppender"},angular.module("cruisemonkey.Logging",["cruisemonkey.Config"]).factory("LoggingService",["config.logging.useStringAppender",function(c){console.log("initializing LoggingService");var d=log4javascript.getLogger();d.removeAllAppenders();var e={getLogHistory:function(){return""},trace:function(){d.trace(Array.prototype.slice.apply(arguments))},debug:function(){d.debug(Array.prototype.slice.apply(arguments))},info:function(){d.info(Array.prototype.slice.apply(arguments))},warn:function(){d.warn(Array.prototype.slice.apply(arguments))},warning:function(){d.warn(Array.prototype.slice.apply(arguments))},error:function(){d.error(Array.prototype.slice.apply(arguments))},fatal:function(){d.fatal(Array.prototype.slice.apply(arguments))}},f=new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} [%-5p] %m");if(c){console.log("initializing StringAppender");var g=new a;g.setLayout(f),d.addAppender(g),e.getLogHistory=function(){return g.getLogHistory()}}else console.log("skipping StringAppender");var h=new b;return h.setLayout(f),d.addAppender(h),e}])}(),function(){"use strict";angular.module("cruisemonkey.User",["angularLocalStorage"]).factory("UserService",["$rootScope","storage",function(a,b){return b.bind(a,"_user",{defaultValue:{loggedIn:!1,username:"",password:""},storeName:"cm.user"}),{loggedIn:function(){return a._user.loggedIn},getUsername:function(){return a._user.loggedIn?a._user.username:void 0},get:function(){return angular.copy(a._user)},save:function(b){a._user=angular.copy(b)},reset:function(){return a._user={loggedIn:!1,username:"",password:""},a._user}}}])}(),function(){"use strict";angular.module("cruisemonkey",["ngRoute","cruisemonkey.Config","cruisemonkey.controllers.About","cruisemonkey.controllers.Advanced","cruisemonkey.controllers.DeckList","cruisemonkey.controllers.Events","cruisemonkey.controllers.Header","cruisemonkey.controllers.Login","cruisemonkey.controllers.Logout","cruisemonkey.Database","cruisemonkey.Navigation","cruisemonkey.Events","cruisemonkey.User","ek.mobileFrame","btford.phonegap.ready"]).config(["$routeProvider","$mobileFrameProvider",function($routeProvider,a){$routeProvider.when("/login",{templateUrl:"template/login.html",controller:"CMLoginCtrl"}).when("/logout",{templateUrl:"template/logout.html",controller:"CMLogoutCtrl"}).when("/events",{redirectTo:"/events/official/"}).when("/events/:eventType",{templateUrl:"template/event-list.html",controller:"CMEventCtrl"}).when("/deck-plans",{redirectTo:"/deck-plans/2/"}).when("/deck-plans/:deck",{templateUrl:"template/deck-plans.html",controller:"CMDeckListCtrl"}).when("/about",{templateUrl:"template/about.html",controller:"CMAboutCtrl"}).when("/advanced",{templateUrl:"template/advanced.html",controller:"CMAdvancedCtrl"}).otherwise({redirectTo:"/events/official/"}),a.setHeaderHeight(40).setFooterHeight(0).setNavWidth(250)}]).run(["$rootScope","$location","UserService","phonegapReady",function(a,b,c,d){a.safeApply=function(a){var b=this.$root.$$phase;"$apply"===b||"$digest"===b?a&&"function"==typeof a&&a():this.$apply(a)},d(function(){StatusBar&&(console.log("StatusBar exists, isVisible = "+StatusBar.isVisible),StatusBar.overlaysWebView(!1),StatusBar.backgroundColorByName("black"))}),a.$on("$routeChangeStart",function(d,e,f){return a.actions=[],a.user=c.get(),c.loggedIn()?(angular.noop(),void 0):"template/event-list.html"===e.templateUrl&&"my"===e.params.eventType?(d.preventDefault(),b.path("/login/"),angular.noop(),void 0):(f&&f.access&&f.access.requiresLogin&&(d.preventDefault(),b.path("/login/"),angular.noop()),angular.noop(),void 0)});var e=function(){var a=b.path();angular.forEach(document.getElementById("nav").children,function(b){if(b.children[0]){var c=b.children[0].href;if(c){"/"===c.charAt(c.length-1)&&(c=c.substr(0,c.length-1));var d=c.indexOf("#");-1!==d&&(c=c.substring(c.indexOf("#")+1)),""===c?angular.element(b).removeClass("selected"):a.startsWith(c)?angular.element(b).addClass("selected"):angular.element(b).removeClass("selected")}}})};a.$on("$routeChangeSuccess",function(){e()}),a.$on("cm.loggedIn",function(){console.log("User logged in, refreshing menu."),e()}),a.$on("cm.loggedOut",function(){console.log("User logged out, refreshing menu."),e()}),a.hideSpinner=!0}])}();