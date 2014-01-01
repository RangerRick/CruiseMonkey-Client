!function(){"use strict";"function"!=typeof String.prototype.capitalize&&(String.prototype.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1).toLowerCase()}),"function"!=typeof String.prototype.startsWith&&(String.prototype.startsWith=function(a){return 0===this.lastIndexOf(a,0)}),"function"!=typeof String.prototype.endsWith&&(String.prototype.endsWith=function(a){return-1!==this.indexOf(a,this.length-a.length)})}(),function(){"use strict";angular.module("cruisemonkey.Config",[]).value("config.logging.useStringAppender",!1).value("config.database.host","cm.raccoonfink.com").value("config.database.name","cruisemonkey").value("config.database.replicate",!0).value("config.app.version","3.90")}(),function(){"use strict";angular.module("cruisemonkey.controllers.About",["cruisemonkey.Database","cruisemonkey.Logging","cruisemonkey.Config"]).controller("CMAboutCtrl",["$scope","$rootScope","LoggingService","config.app.version",function(a,b,c,d){c.info("Initializing CMAboutCtrl"),b.title="About CruiseMonkey "+d}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Advanced",["cruisemonkey.Logging","cruisemonkey.Config"]).controller("CMAdvancedCtrl",["$scope","$rootScope","Database","LoggingService","config.app.version",function(a,b,c,d){d.info("Initializing CMAdvancedCtrl"),b.title="Break CruiseMonkey!",a.resetDatabase=function(){c.reset()}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.DeckList",["ngRoute","cruisemonkey.Logging","hammer"]).controller("CMDeckListCtrl",["$scope","$rootScope","$routeParams","$location","LoggingService",function(a,b,c,d,e){e.info("Initializing CMDeckListCtrl"),a.deck=parseInt(c.deck,10),b.title="Deck "+a.deck,a.previous=function(){f()},a.next=function(){g()};var f=function(){a.safeApply(function(){if(2!==a.deck){var b=a.deck-1;e.info("previous() going down to deck "+b),d.path("/deck-plans/"+b)}})},g=function(){a.safeApply(function(){if(15!==a.deck){var b=a.deck+1;e.info("next() going up to deck "+b),d.path("/deck-plans/"+b)}})},h=function(a){return console.log("received event: ",a),37===a.keyCode?(f(),!1):39===a.keyCode?(g(),!1):!0};b.actions=[],2!==a.deck&&b.actions.push({name:"Previous",iconClass:"arrow-left4",launch:function(){f()}}),15===a.deck?b.actions.push({name:"Blank",iconClass:"blank",launch:function(){}}):b.actions.push({name:"Next",iconClass:"arrow-right4",launch:function(){g()}}),document.addEventListener("keydown",h,!0),a.$on("$destroy",function(){document.removeEventListener("keydown",h,!0)})}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Events",["ngRoute","cruisemonkey.User","cruisemonkey.Events","cruisemonkey.Logging","ui.bootstrap.modal"]).filter("orderByEvent",function(){return function(a){if(!angular.isObject(a))return a;var b=[];for(var c in a){var d=a[c];d.isNewDay=!1,b.push(d)}var e,f;b.sort(function(a,b){return e=a.start,f=b.start,e.isBefore(f)?-1:e.isAfter(f)?1:(e=a.summary.toLowerCase(),f=b.summary.toLowerCase(),e>f?1:f>e?-1:(e=a.end,f=b.end,e.isBefore(f)?-1:e.isAfter(f)?1:0))});var g,h;angular.forEach(b,function(a,b){a.isNewDay=!1,h=a.start,0===b?a.isNewDay=!0:h.isAfter(g,"day")&&(a.isNewDay=!0),g=h});for(var i=0;i<b.length;i++)0===i&&(b[i].isNewDay=!0);return b}}).controller("CMEditEventCtrl",["$q","$scope","$rootScope","$modal","UserService","LoggingService",function(a,b,c,d,e,f){f.info("Initializing CMEditEventCtrl");var g="YYYY-MM-DD HH:mm";if(Modernizr.inputtypes["datetime-local"]&&(g="YYYY-MM-DDTHH:mm"),c.editEvent)b.event=angular.copy(c.editEvent),delete c.editEvent,b.event.start=b.event.start.format(g),b.event.end=b.event.end.format(g),f.info("Found existing event to edit."),console.log(b.event);else{var h=moment();b.event={start:h.format(g),end:h.add("hours",1).format(g),type:"event",username:e.getUsername(),isPublic:!0},f.info("Created fresh event."),console.log(b.event)}}]).controller("CMEventCtrl",["$scope","$rootScope","$timeout","$routeParams","$location","$q","$modal","$templateCache","UserService","EventService","LoggingService",function(a,b,c,d,e,f,g,h,i,j,k){k.info("Initializing CMEventCtrl"),b.eventType=d.eventType,b.title=d.eventType.capitalize()+" Events";var l=function(){k.info("CMEventCtrl.refreshEvents()"),"official"===d.eventType?b.events=j.getOfficialEvents():"unofficial"===d.eventType?b.events=j.getUnofficialEvents():"my"===d.eventType?b.events=j.getMyEvents():k.warn("CMEventCtrl: unknown event type: "+d.eventType)};a.prettyDate=function(a){return a?a.format("dddd, MMMM Do"):void 0},a.fuzzy=function(a){return a?a.fromNow():void 0},a.justTime=function(a){return a?a.format("hh:mma"):void 0},a.trash=function(b){a.safeApply(function(){f.all([j.removeEvent(b),a.events]).then(function(a){var b=a[0],c=a[1];console.log("removed = ",b),delete c[b.id]})})},a.edit=function(c){a.safeApply(function(){console.log("edit: ",c),b.editEvent=c;var d=g.open({templateUrl:"edit-event.html",controller:"CMEditEventCtrl"});d.result.then(function(b){k.info("Save finished!"),console.log(b),f.all([j.updateEvent(b),a.events]).then(function(a){var c=a[1];b.start=moment(b.start),b.end=moment(b.end),c[b._id]=b,k.info("Finished updating event.")})},function(){k.warn("Add canceled!")})})},a.onFavoriteChanged=function(b,c){if(k.info("CMEventCtrl.onFavoriteChanged("+b+", "+c+")"),c)j.addFavorite(b);else{for(var d=0;d<a.events;d++)a.events[d]._id===b&&a.events.splice(d,1);j.removeFavorite(b)}},a.onPublicChanged=function(b,c){console.log("onPublicChanged: ",b,c),b.isPublic=c,f.when(a.events).then(function(a){a[b._id].isPublic=c,j.updateEvent(a[b._id])})},b.$on("cm.eventUpdated",function(){l()}),b.$on("cm.eventDeleted",function(){l()}),c(function(){l()},0),b.actions=[],i.getUsername()&&""!==i.getUsername()&&b.actions.push({name:"Add Event",iconClass:"add",launch:function(){k.info("launching modal");var b=g.open({templateUrl:"edit-event.html",controller:"CMEditEventCtrl"});b.result.then(function(b){k.info("Save finished!"),console.log(b),f.all([j.addEvent(b),a.events]).then(function(a){var b=a[0],c=a[1];b.start=moment(b.start),b.end=moment(b.end),c[b._id]=b})},function(){k.warn("Add canceled!")})}})}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Header",["cruisemonkey.Logging"]).controller("CMHeaderCtrl",["$scope","$rootScope","$location","LoggingService",function(a,b,c,d){d.info("Initializing CMHeaderCtrl")}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Login",["cruisemonkey.Logging","cruisemonkey.User"]).controller("CMLoginCtrl",["$scope","$rootScope","$location","UserService","LoggingService",function(a,b,c,d,e){e.info("Initializing CMLoginCtrl"),b.title="Log In",b.user=d.get(),a.isUnchanged=function(a){var b=d.get();return null===b||void 0===b?null===a||void 0===a?!0:!1:b.username===a.username&&b.password===a.password},a.reset=function(){var a=d.get();e.info("resetting user: ",a),b.user=a,b.$broadcast("cm.loggedOut"),c.path("/events/official")},a.update=function(a){return"official"===a.username?(console.log('Attempt to log in as "official", skipping.'),c.path("/events/official"),void 0):(a.loggedIn=!0,e.info("saving user"),console.log(a),d.save(a),b.user=d.get(),b.$broadcast("cm.loggedIn"),c.path("/events/my"),void 0)}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Logout",["cruisemonkey.Logging","cruisemonkey.User"]).controller("CMLogoutCtrl",["$scope","$rootScope","$routeParams","$location","UserService","LoggingService",function(a,b,c,d,e,f){f.info("Initializing CMLogoutCtrl"),b.title="Logging Out",b.user=e.reset(),d.replace(),d.path("/events/official")}])}(),function(){"use strict";angular.module("cruisemonkey.Navigation",["cruisemonkey.Logging"]).controller("CMNavigationCtrl",["$rootScope","$scope","$location","$document","UserService","LoggingService","$mobileFrame",function(a,b,c,d,e,f,g){f.info("Initializing CMNavigationCtrl"),b.toggleDrawer=function(){return g.navVisible()&&g.toggleNav(),!0}}])}(),function(){"use strict";angular.module("cruisemonkey.Database",["cruisemonkey.Logging","cruisemonkey.Config","ngInterval","angularLocalStorage"]).factory("Database",["$location","$interval","$timeout","$rootScope","$window","LoggingService","storage","config.database.host","config.database.name","config.database.replicate",function(a,b,c,d,e,f,g,h,i,j){f.info("Initializing CruiseMonkey database: "+i),g.bind(d,"_seq",{defaultValue:0,storeName:"cm.db.sync"}),f.info("last sequence: "+d._seq),h||(h=a.host());var k="http://"+h+":5984/"+i,l=null,m=null,n=!1,o=function(){l=new Pouch(i),m=null,n=!1,l.compact(),f.info("Database.initializeDatabase(): Database initialization complete."),d.$broadcast("cm.databaseInitialized")},p=function(){if(!n){n=!0,f.info("Watching for document changes.");var a=d._seq;a||(a=0),l.changes({since:a,onChange:function(a){console.log("change: ",a),a.seq&&(d._seq=a.seq),a.deleted?d.$broadcast("cm.documentDeleted",a):d.$broadcast("cm.documentUpdated",a.doc)},continuous:!0,include_docs:!0}),f.info("Database.databaseReady(): Database ready for change updates."),d.$broadcast("cm.databaseReady")}},q=function(){f.info("Attempting to replicate with "+k),d.$broadcast("cm.replicationStarting"),l.replicate.from(k,{complete:function(){l.replicate.to(k,{complete:function(){f.debug("Replication complete."),d.$broadcast("cm.replicationComplete")}})}})},r=function(){return j?null!==m?(f.warn("Replication has already been started!  Timeout ID = "+m),!1):(f.info("Enabling replication with "+k),m=b(function(){q()},1e4),q(),!0):(f.warn("startReplication() called, but replication is not enabled!"),!1)},s=function(){return j?null!==m?(f.info("Stopping replication with "+k),b.cancel(m),m=null,!0):(f.info("Replication is already stopped!"),!1):(f.warn("stopReplication() called, but replication is not enabled!"),void 0)},t=function(a){void 0!==navigator.connection.type?(console.log("Connection type is: "+navigator.connection.type),navigator.connection.type===Connection.NONE?s():r()):void 0!==navigator.connection.bandwidth?(console.log("Connection bandwidth is: "+navigator.connection.bandwidth),navigator.connection.bandwidth>0?r():s()):(f.info("Got a connection type event."),console.log(a))},u=function(){c(function(){navigator&&navigator.connection?navigator.connection.addEventListener?(f.info("Database.setUp(): Browser has native navigator.connection support."),navigator.connection.addEventListener("change",t,!1),t()):(f.info("Database.setUp(): Browser does not have native navigator.connection support.  Trying with phonegap."),document.addEventListener("online",t,!1),document.addEventListener("offline",t,!1),t()):(f.warn("Database.setUp(): Unsure how to handle connection management; starting replication and hoping for the best."),r()),p()},0)},v=function(){s(),navigator&&navigator.connection&&navigator.connection.removeEventListener?navigator.connection.removeEventListener("change",t,!1):(document.removeEventListener("online",t,!1),document.removeEventListener("offline",t,!1))},w=function(){d.safeApply(function(){v(),n=!1,d._seq=0,Pouch.destroy(i,function(a){a?e.alert("Failed to destroy existing database!"):(f.info("Reloading CruiseMonkey."),e.location.reload())})})};return o(),u(),{reset:w,database:l,startReplication:r,stopReplication:s}}])}(),function(){"use strict";function a(a){var b=this;b.initialize=function(a){b._rawdata=a||{},b._favorite=void 0,b._newDay=!1,b._start=void 0,b._end=void 0,b._rawdata.type="event",delete b._rawdata.isFavorite,delete b._rawdata.isNewDay},b.getId=function(){return b._rawdata._id},b.setId=function(a){b._rawdata._id=a},b.getRevision=function(){return b._rawdata._rev},b.setRevision=function(a){b._rawdata._rev=a},b.getSummary=function(){return b._rawdata.summary},b.setSummary=function(a){b._rawdata.summary=a},b.getDescription=function(){return b._rawdata.description},b.setDescription=function(a){b._rawdata.description=a},b.getStart=function(){return void 0===b._start&&(b._start=moment(b._rawdata.start)),b._start},b.setStart=function(a){"string"==typeof a||a instanceof String?(b._rawdata.start=a,b._start=void 0):b._rawdata.start=c(a)},b.getEnd=function(){return void 0===b._end&&(b._end=moment(b._rawdata.end)),b._end},b.setEnd=function(a){("string"==typeof a||a instanceof String)&&(b._rawdata.end=a,b._end=void 0)},b.getUsername=function(){return b._rawdata.username&&""!==b._rawdata.username?b._rawdata.username:void 0},b.setUsername=function(a){b._rawdata.username=a},b.isPublic=function(){return b._rawdata.isPublic},b.setPublic=function(a){b._rawdata.isPublic=a},b.isNewDay=function(){return b._newDay},b.setNewDay=function(a){b._newDay=a},b.isFavorite=function(){return void 0!==b._favorite},b.getFavorite=function(){return b._favorite},b.setFavorite=function(a){b._favorite=a},b.toString=function(){return"CMEvent[id="+b._rawdata._id+",summary="+b._rawdata.summary+"]"},b.getRawData=function(){return b._rawdata},b.initialize(a)}function b(a){var b=this;b._rawdata=a||{},b._rawdata.type="favorite",b._event=void 0,b.getId=function(){return b._rawdata._id},b.setId=function(a){b._rawdata._id=a},b.getEventId=function(){return b._rawdata.eventId},b.setEventId=function(a){b._rawdata.eventId=a},b.getUsername=function(){return b._rawdata.username},b.setUsername=function(a){b._rawdata.username=a},b.getEvent=function(){return b._event},b.setEvent=function(a){b._event=a},b.toString=function(){return"CMFavorite[id="+b.getId()+",username="+b.getUsername()+",eventId="+b.getEventId()+"]"},b.getRawData=function(){return b._rawdata}}var c=function(a){return null===a||void 0===a?void 0:moment(a).format("YYYY-MM-DD HH:mm")};angular.module("cruisemonkey.Events",["cruisemonkey.Config","cruisemonkey.Database","cruisemonkey.User","cruisemonkey.Logging"]).factory("EventService",["$q","$rootScope","$timeout","$http","$location","Database","UserService","LoggingService","config.database.host","config.database.name","config.database.replicate",function(c,d,e,$http,f,g,h,i,j,k,l){i.info("EventService: Initializing EventService.");var m=c.defer(),n={},o={},p=[],q=function(a){i.debug("EventService.storeEvent("+a.getId()+")"),n[a.getId()]=a},r=function(a){delete n[a]},s=function(a){o[a.getId()]=a},t=function(a){delete o[a]},u=function(a){return n[a]},v=function(a){var b=h.getUsername();if(!b)return i.debug("EventService.getFavoriteByEventId(): Not logged in."),void 0;var c=u(a);if(c&&c.isFavorite())return c.getFavorite();var d;return angular.forEach(o,function(b){return b.getEventId()===a?(d=b,!1):void 0}),d},w=function(a){return o[a]},x=function(b,c){var e;e=b instanceof a?b:new a(b),i.debug("EventService.handleEventUpdated(): Event updated: "+e.toString());var f=v(e.getId());e.setFavorite(f),f&&f.setEvent(e),q(e),"undefined"!=typeof c&&c||d.$broadcast("cm.eventUpdated",e)},y=function(a,c){var e;e=a instanceof b?a:new b(a),i.debug("EventService.handleFavoriteUpdated(): Updating favorite: "+e.toString());var f=h.getUsername();if(!f)return i.warning("EventService.handleFavoriteUpdated(): user is not logged in!"),void 0;if(f!==e.getUsername())return i.warning("EventService.handleFavoriteUpdated(): favorite does not belong to "+f+"!"),void 0;var g=u(e.getEventId());e.setEvent(g),g?g.setFavorite(e):i.warning("EventService.handleFavoriteUpdated(): favorite "+e.getId()+" updated, but event "+e.getEventId()+" not found."),s(e),"undefined"!=typeof c&&c||(g&&d.$broadcast("cm.eventUpdated",g),d.$broadcast("cm.favoriteUpdated",e))},z=function(a,b){i.debug("EventService.handleEventDeleted(): Event "+a+" deleted.");var c=u(a);if(c&&c.isFavorite()){var e=c.getFavorite();t(e.getId())}r(a),"undefined"!=typeof b&&b||d.$broadcast("cm.eventDeleted",c)},A=function(a,b){i.debug("EventService.handleFavoriteDeleted("+a+")");var c=w(a);if(c){var e=c.getEvent();e&&(e.setFavorite(void 0),"undefined"!=typeof b&&b||d.$broadcast("cm.eventUpdated",e)),t(a)}else i.warn("EventService.handleFavoriteDeleted(): no favorite with id "+a+" found.")},B=function(a,b,e){var f=c.defer();return g.database.query({map:b},e,function(b,c){d.$apply(function(){if(b)i.error(b),f.reject(b);else{var d,e=[];for(d=0;d<c.total_rows;d++){var g=c.rows[d].value;e.push(new a(g))}i.debug("results =",e),f.resolve(e)}})}),f.promise},C=function(a){var b=c.defer();return setTimeout(function(){d.$apply(function(){b.resolve(a)})},0),b.promise},D=function(b){var e;e=b instanceof a?b:new a(b);var f=c.defer();return c.when(m.promise).then(function(){e.getUsername()?(i.info('EventService.addEvent(): posting event "'+e.getSummary()+'" for user "'+e.getUsername()+'"'),g.database.post(e.getRawData(),function(a,b){d.$apply(function(){a?(i.error(a),f.reject(a)):(e.setId(b.id),e.setRevision(b.rev),i.info("eventToAdd: "+e.toString()),x(e),f.resolve(e))})})):(i.info("EventService.addEvent(): no username in the event!"),f.reject("no username specified"))}),f.promise},E=function(b){var e,f=c.defer();return e=b instanceof a?b:new a(b),e.getRevision()&&e.getId()?(c.when(m.promise).then(function(){g.database.put(e.getRawData(),function(a,b){d.$apply(function(){a?(i.error(a),f.reject(a)):(e.setRevision(b.rev),x(e),f.resolve(e))})})}),f.promise):(i.warn("EventService.updateEvent(): Attempting to update event "+e.summary+", but it is missing _rev or _id!"),f.reject("bad event"),f.promise)},F=function(b){var e;e=b instanceof a?b.getRawData():b,i.info("EventService.removeEvent("+e._id+")");var f=c.defer();return c.when(m.promise).then(function(){g.database.remove(e,function(a,b){d.$apply(function(){a?(i.error(a),f.reject(a)):(z(e._id),f.resolve(b))})})}),f.promise},G=function(a){var b=c.defer();return c.when(m.promise).then(function(){b.resolve(n[a])}),b.promise},H=function(){return i.info("EventService.getAllEvents()"),B(a,function(a){"event"===a.type&&emit(a.username,a)},{reduce:!0})},I=function(){return i.info("EventService.getAllFavorites()"),B(b,function(a){"favorite"===a.type&&emit(a.username,a)},{reduce:!0})},J=function(){i.info("EventService.getOfficialEvents()");var a=c.defer();return c.when(m.promise).then(function(){var b=[];angular.forEach(n,function(a){"official"===a.getUsername()&&b.push(a)}),a.resolve(b)},function(a){i.error("EventService.getOfficialEvents(): error = "+a)}),a.promise},K=function(){i.info("EventService.getUnofficialEvents()");var a=c.defer();return c.when(m.promise).then(function(){var b=[];angular.forEach(n,function(a){a.isPublic()&&"official"!==a.getUsername()&&b.push(a)}),a.resolve(b)}),a.promise},L=function(){i.info("EventService.getUserEvents()");var a=h.getUsername();if(!a)return i.warn("EventService.getUserEvent(): user not logged in"),C([]);var b=c.defer();return c.when(m.promise).then(function(){var c=[];angular.forEach(n,function(b){b.getUsername()===a&&c.push(b)}),b.resolve(c)}),b.promise},M=function(){i.info("EventService.getMyEvents()");var a=h.getUsername();if(!a)return i.warn("EventService.getMyEvents(): user not logged in"),C([]);var b=c.defer();return c.when(m.promise).then(function(){var c=[];angular.forEach(n,function(b){return b.getUsername()===a?(c.push(b),void 0):b.isFavorite()?(c.push(b),void 0):void 0}),b.resolve(c)}),b.promise},N=function(){var a=h.getUsername();if(!a)return i.warn("EventService.getMyFavorites(): user not logged in"),C([]);var b=c.defer();return c.when(m.promise).then(function(){var c=[];angular.forEach(o,function(b){b.getUsername()===a&&c.push(b.eventId)}),b.resolve(c)}),b.promise},O=function(a){var b=h.getUsername();if(!b)return i.warn("EventService.isFavorite(): user not logged in"),C(!1);var d=c.defer();return c.when(m.promise).then(function(){var b=u(a);d.resolve(b.isFavorite())}),d.promise},P=function(a){i.info("EventService.addFavorite("+a+")");var b=h.getUsername();if(!b||!a)return i.warn("EventService.addFavorite(): user not logged in, or no eventId passed"),C(void 0);var e=c.defer(),f={type:"favorite",username:b,eventId:a};return g.database.post(f,function(a,b){d.$apply(function(){a?(i.error(a),e.reject(a)):(f._id=b.id,f._rev=b.rev,y(f),e.resolve(f))})}),e.promise},Q=function(a){i.info("EventService.removeFavorite("+a+")");var b=h.getUsername();if(!b||!a)return i.warn("EventService.removeFavorite(): user not logged in, or no eventId passed"),C(void 0);var e=c.defer();return g.database.query({map:function(a){"favorite"===a.type&&emit({username:a.username,eventId:a.eventId},a._id)}},{reduce:!0,include_docs:!0,key:{username:b,eventId:a}},function(a,b){d.$apply(function(){if(a)i.error(a),e.reject(a);else if(b.total_rows>0){var f=[];angular.forEach(b.rows,function(a){var b=c.defer();f.push(b.promise);var e=a.value,h=a.doc;g.database.remove(h,function(a,c){d.$apply(function(){a?(i.error(a),b.reject(a)):(A(e),b.resolve(c))})})}),c.all(f).then(function(){e.resolve(b.total_rows)},function(a){e.reject(a)})}else e.resolve(b.total_rows)})}),e.promise},R=function(){j||(j=f.host());var a="http://"+j+":5984/"+k,b=c.defer();return l?$http.get(a+"/_all_docs?include_docs=true",{headers:{Accept:"application/json"}}).success(function(a){b.resolve(a)}).error(function(a,c){i.error("EventService.getRemoteDocs(): failed to get all_docs from remote host = ",c),b.reject(c)}):e(function(){i.info("EventService.getRemoteDocs(): replication disabled, resolving with empty object"),b.resolve({})}),b.promise},S=function(){c.all([H(),I(),R()]).then(function(a){i.info("EventService.initEventCache(): Retrieved events & favorites from the database; pushing to cache.");var b=a[0],c=a[1],d=a[2];if(angular.forEach(b,function(a){x(a)}),angular.forEach(c,function(a){y(a)}),d&&d.total_rows){i.info("EventService.initEventCache(): remote =",d);for(var e=0;e<d.total_rows;e++){var f=d.rows[e].doc;if("event"===f.type){var g=f;delete g.isFavorite,delete g.isNewDay,x(g)}else if("favorite"===f.type){var h=f;y(h)}}}m.resolve(!0),i.info("EventService.initEventCache(): finished initializing.")}),d.$on("cm.documentUpdated",function(c,d){d instanceof a?x(d):d instanceof b?y(d):"event"===d.type?x(d):"favorite"===d.type?y(d):console.log("unhandled document update:",d)}),d.$on("cm.documentDeleted",function(c,d){if(d instanceof a)z(d.getId());else if(d instanceof b)A(d.getId());else{var e=u(d.id);if(e)return z(e.getId()),void 0;var f=w(d.id);if(f)return A(f.getId()),void 0;console.log("unhandled document deletion:",d)}})};return d.$on("$destroy",function(){angular.forEach(p,function(a){a()})}),d.$on("cm.databaseReady",function(){i.info("EventService: Initializing caches."),S()}),{_reinit:S,addEvent:D,updateEvent:E,removeEvent:F,getEvent:G,getAllEvents:H,getOfficialEvents:J,getUnofficialEvents:K,getUserEvents:L,getMyEvents:M,getMyFavorites:N,isFavorite:O,addFavorite:P,removeFavorite:Q}}])}(),function(){"use strict";function a(){}function b(){}a.prototype=new log4javascript.Appender,a.prototype.layout=new log4javascript.NullLayout,a.prototype.threshold=log4javascript.Level.DEBUG,a.prototype._saLogHistory="",a.prototype._saIndentLevel=0,a.prototype._getPrefix=function(){for(var a="",b=0;b<this._saIndentLevel;b++)a+=" ";return a},a.prototype._increaseIndentLevel=function(){this._saIndentLevel+=2},a.prototype._decreaseIndentLevel=function(){this._saIndentLevel-=2,this._saIndentLevel<0&&(this._saIndentLevel=0)},a.prototype._resetLogHistory=function(){this._saLogHistory="",this._saIndentLevel=0},a.prototype._addToLogHistory=function(a){void 0===this._saLogHistory?this._saLogHistory=this._getPrefix()+a+"\n":this._saLogHistory+=this._getPrefix()+a+"\n"},a.prototype.getLogHistory=function(){return this._saLogHistory||""},a.prototype.append=function(a){var b=this,c=function(){var c=b.getLayout(),d=c.format(a);return c.ignoresThrowable()&&a.exception&&(d+=a.getThrowableStrRep()),d};b._addToLogHistory(c())},a.prototype.group=function(a){this._addToLogHistory("=== "+a+" ==="),this._increaseIndentLevel()},a.prototype.groupEnd=function(){this._decreaseIndentLevel()},a.prototype.toString=function(){return"StringAppender"},b.prototype=new log4javascript.Appender,b.prototype.layout=new log4javascript.NullLayout,b.prototype.threshold=log4javascript.Level.DEBUG,b.prototype.append=function(a){var b=this,c=function(){var c=b.getLayout(),d=c.format(a);return c.ignoresThrowable()&&a.exception&&(d+=a.getThrowableStrRep()),d};console.log(c())},b.prototype.group=function(a){console.group&&console.group(a)},b.prototype.groupEnd=function(){console.groupEnd&&console.groupEnd()},b.prototype.toString=function(){return"ConsoleAppender"},angular.module("cruisemonkey.Logging",["cruisemonkey.Config"]).factory("LoggingService",["config.logging.useStringAppender",function(c){console.log("initializing LoggingService");var d=log4javascript.getLogger();d.removeAllAppenders();var e={getLogHistory:function(){return""},trace:function(){d.trace(Array.prototype.slice.apply(arguments))},debug:function(){d.debug(Array.prototype.slice.apply(arguments))},info:function(){d.info(Array.prototype.slice.apply(arguments))},warn:function(){d.warn(Array.prototype.slice.apply(arguments))},warning:function(){d.warn(Array.prototype.slice.apply(arguments))},error:function(){d.error(Array.prototype.slice.apply(arguments))},fatal:function(){d.fatal(Array.prototype.slice.apply(arguments))}},f=new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} [%-5p] %m");if(c){console.log("initializing StringAppender");var g=new a;g.setLayout(f),d.addAppender(g),e.getLogHistory=function(){return g.getLogHistory()}}else console.log("skipping StringAppender");var h=new b;return h.setLayout(f),d.addAppender(h),e}])}(),function(){"use strict";angular.module("cruisemonkey.User",["angularLocalStorage"]).factory("UserService",["$rootScope","storage",function(a,b){return b.bind(a,"_user",{defaultValue:{loggedIn:!1,username:"",password:""},storeName:"cm.user"}),{loggedIn:function(){return a._user.loggedIn},getUsername:function(){return a._user.loggedIn?a._user.username:void 0},get:function(){return angular.copy(a._user)},save:function(b){a._user=angular.copy(b)},reset:function(){return a._user={loggedIn:!1,username:"",password:""},a._user}}}])}(),function(){"use strict";angular.module("cruisemonkey",["ngRoute","cruisemonkey.Config","cruisemonkey.controllers.About","cruisemonkey.controllers.Advanced","cruisemonkey.controllers.DeckList","cruisemonkey.controllers.Events","cruisemonkey.controllers.Header","cruisemonkey.controllers.Login","cruisemonkey.controllers.Logout","cruisemonkey.Database","cruisemonkey.Navigation","cruisemonkey.Events","cruisemonkey.User","ek.mobileFrame","btford.phonegap.ready"]).config(["$routeProvider","$mobileFrameProvider",function($routeProvider,a){$routeProvider.when("/login",{templateUrl:"template/login.html",controller:"CMLoginCtrl"}).when("/logout",{templateUrl:"template/logout.html",controller:"CMLogoutCtrl"}).when("/events",{redirectTo:"/events/official/"}).when("/events/:eventType",{templateUrl:"template/event-list.html",controller:"CMEventCtrl"}).when("/deck-plans",{redirectTo:"/deck-plans/2/"}).when("/deck-plans/:deck",{templateUrl:"template/deck-plans.html",controller:"CMDeckListCtrl"}).when("/about",{templateUrl:"template/about.html",controller:"CMAboutCtrl"}).when("/advanced",{templateUrl:"template/advanced.html",controller:"CMAdvancedCtrl"}).otherwise({redirectTo:"/events/official/"}),a.setHeaderHeight(40).setFooterHeight(0).setNavWidth(250)}]).run(["$rootScope","$location","UserService","EventService","phonegapReady",function(a,b,c,d,e){a.safeApply=function(a){var b=this.$root.$$phase;"$apply"===b||"$digest"===b?a&&"function"==typeof a&&a():this.$apply(a)},e(function(){StatusBar&&(console.log("StatusBar exists, isVisible = "+StatusBar.isVisible),StatusBar.overlaysWebView(!1),StatusBar.backgroundColorByName("black"))}),a.$on("$routeChangeStart",function(d,e,f){return a.actions=[],a.user=c.get(),c.loggedIn()?(angular.noop(),void 0):"template/event-list.html"===e.templateUrl&&"my"===e.params.eventType?(d.preventDefault(),b.path("/login/"),angular.noop(),void 0):(f&&f.access&&f.access.requiresLogin&&(d.preventDefault(),b.path("/login/"),angular.noop()),angular.noop(),void 0)});var f=function(){var a=b.path();angular.forEach(document.getElementById("nav").children,function(b){if(b.children[0]){var c=b.children[0].href;if(c){"/"===c.charAt(c.length-1)&&(c=c.substr(0,c.length-1));var d=c.indexOf("#");-1!==d&&(c=c.substring(c.indexOf("#")+1)),""===c?angular.element(b).removeClass("selected"):a.startsWith(c)?angular.element(b).addClass("selected"):angular.element(b).removeClass("selected")}}})};a.$on("$routeChangeSuccess",function(){f()}),a.$on("cm.loggedIn",function(){console.log("User logged in, refreshing menu."),f()}),a.$on("cm.loggedOut",function(){console.log("User logged out, refreshing menu."),f()}),a.hideSpinner=!0}])}();