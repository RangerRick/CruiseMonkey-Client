function stringifyDate(a){"use strict";return null===a||void 0===a?void 0:moment(a).format("YYYY-MM-DD HH:mm")}function CMEvent(a){"use strict";var b=this;b.initialize=function(a){b._rawdata=a||{},b._favorite=void 0,b._newDay=!1,b._start=void 0,b._end=void 0,b._rawdata.type="event",delete b._rawdata.isFavorite,delete b._rawdata.isNewDay},b.getId=function(){return b._rawdata._id},b.setId=function(a){b._rawdata._id=a},b.getRevision=function(){return b._rawdata._rev},b.setRevision=function(a){b._rawdata._rev=a},b.getSummary=function(){return b._rawdata.summary},b.setSummary=function(a){b._rawdata.summary=a},b.getDescription=function(){return b._rawdata.description},b.setDescription=function(a){b._rawdata.description=a},b.getStart=function(){return void 0===b._start&&(b._start=moment(b._rawdata.start)),b._start},b.setStart=function(a){b._rawdata.start="string"==typeof a||a instanceof String?a:stringifyDate(a),b._start=void 0},b.getStartString=function(){return b._rawdata.start},b.setStartString=function(a){b._rawdata.start=a,b._start=void 0},b.getEnd=function(){return void 0===b._end&&(b._end=moment(b._rawdata.end)),b._end},b.setEnd=function(a){b._rawdata.end="string"==typeof a||a instanceof String?a:stringifyDate(a),b._end=void 0},b.getEndString=function(){return b._rawdata.end},b.setEndString=function(a){b._rawdata.end=a,b._end=void 0},b.getUsername=function(){return b._rawdata.username&&""!==b._rawdata.username?b._rawdata.username:void 0},b.setUsername=function(a){b._rawdata.username=a},b.getLocation=function(){return b._rawdata.location},b.setLocation=function(a){b._rawdata.location=a},b.isPublic=function(){return b._rawdata.isPublic},b.setPublic=function(a){b._rawdata.isPublic=a},b.isNewDay=function(){return b._newDay},b.setNewDay=function(a){b._newDay=a},b.isFavorite=function(){return void 0!==b._favorite},b.getFavorite=function(){return b._favorite},b.setFavorite=function(a){b._favorite=a},b.toEditableBean=function(){return{id:b.getId(),revision:b.getRevision(),startDate:b.getStart().format(dateStringFormat),endDate:b.getEnd().format(dateStringFormat),summary:b.getSummary(),description:b.getDescription(),location:b.getLocation(),isPublic:b.isPublic()}},b.fromEditableBean=function(a){b.setId(a.id),b.setRevision(a.revision),b.setStart(moment(a.startDate)),b.setEnd(moment(a.endDate)),b.setSummary(a.summary),b.setDescription(a.description),b.setLocation(a.location),b.setPublic(a.isPublic)},b.toString=function(){return"CMEvent[id="+b._rawdata._id+",summary="+b._rawdata.summary+"]"},b.getRawData=function(){return b._rawdata},b.matches=function(a){return void 0===a||""===a?!0:void 0!==b.getSummary()&&b.getSummary().contains(a)?!0:void 0!==b.getDescription()&&b.getDescription().contains(a)?!0:void 0!==b.getLocation()&&b.getLocation().contains(a)?!0:!1},b.initialize(a)}function CMFavorite(a){"use strict";var b=this;b._rawdata=a||{},b._rawdata.type="favorite",b._event=void 0,b.getId=function(){return b._rawdata._id},b.setId=function(a){b._rawdata._id=a},b.getEventId=function(){return b._rawdata.eventId},b.setEventId=function(a){b._rawdata.eventId=a},b.getUsername=function(){return b._rawdata.username},b.setUsername=function(a){b._rawdata.username=a},b.getEvent=function(){return b._event},b.setEvent=function(a){b._event=a},b.toString=function(){return"CMFavorite[id="+b.getId()+",username="+b.getUsername()+",eventId="+b.getEventId()+"]"},b.getRawData=function(){return b._rawdata}}!function(){"use strict";angular.module("cruisemonkey.Config",[]).value("config.logging.useStringAppender",!1).value("config.database.host","cm.raccoonfink.com").value("config.database.name","cruisemonkey").value("config.database.replicate",!0).value("config.twitarr.root","https://twitarr.rylath.net/").value("config.app.version","3.90"),angular.module("cruisemonkey.Settings",["cruisemonkey.Config","angularLocalStorage"]).factory("SettingsService",["storage","$rootScope","config.database.host","config.database.name","config.twitarr.root",function(a,b,c,d,e){return a.bind(b,"_settings",{defaultValue:{"database.host":c,"database.name":d,"twitarr.root":e},storeName:"cm.settings"}),{getSettings:function(){return angular.copy({databaseHost:b._settings["database.host"],databaseName:b._settings["database.name"],twitarrRoot:b._settings["twitarr.root"]})},getDatabaseHost:function(){return angular.copy(b._settings["database.host"])},setDatabaseHost:function(a){b._settings["database.host"]=angular.copy(a)},getDatabaseName:function(){return angular.copy(b._settings["database.name"])},setDatabaseName:function(a){b._settings["database.host"]=angular.copy(a)},getTwitarrRoot:function(){return angular.copy(b._settings["twitarr.root"])},setTwitarrRoot:function(a){b._settings["twitarr.root"]=angular.copy(a)}}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.About",["cruisemonkey.Database","cruisemonkey.Logging","cruisemonkey.Config"]).controller("CMAboutCtrl",["$scope","$rootScope","LoggingService","config.app.version",function(a,b,c,d){c.info("Initializing CMAboutCtrl"),b.title="About CM4",b.rightButtons=[],a.version=d}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Advanced",["cruisemonkey.Logging","cruisemonkey.Config","cruisemonkey.Settings"]).controller("CMAdvancedCtrl",["$scope","$rootScope","Database","LoggingService","config.app.version","SettingsService",function(a,b,c,d,e,f){d.info("Initializing CMAdvancedCtrl"),b.title="Advanced Options",b.rightButtons=[],a.settings=f.getSettings(),a.openCertificate=function(){window.open("http://ranger.befunk.com/misc/twitarr.rylath.net.cer","_system")},a.isUnchanged=function(){var b=f.getSettings(),c=a.settings;return b.databaseHost===c.databaseHost&&b.databaseName===c.databaseName&&b.twitarrRoot===c.twitarrRoot},a.resetSettings=function(){var b=f.getSettings();console.log("resetting to",b),a.settings=b},a.saveSettings=function(){console.log("saving=",a.settings),f.setDatabaseHost(a.settings.databaseHost),f.setDatabaseName(a.settings.databaseName),f.setTwitarrRoot(a.settings.twitarrRoot)},a.resetDatabase=function(){c.reset()}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.DeckList",["angularLocalStorage","cruisemonkey.Logging"]).controller("CMDeckListCtrl",["storage","$scope","$rootScope","$timeout","$state","$stateParams","$location","LoggingService",function(a,b,c,d,e,f,g,h){if(h.info("Initializing CMDeckListCtrl"),a.bind(b,"_deck",{defaultValue:"2",storeName:"cm.deck"}),h.info("$scope._deck: "+b._deck),b.deck=2,f.deck){h.info("$stateParams.deck: "+f.deck);var i=parseInt(f.deck,10);i&&i>0&&(b.deck=i)}else if(b._deck){h.info("$scope._deck: "+b._deck);var j=parseInt(b._deck,10);j&&j>0&&(b.deck=j)}b.$watch("deckIndex",function(a,c){h.info("deckIndex changed. oldValue: "+c+", newValue: "+a),b._deck=(a+2).toString()}),b.previous=function(){k()},b.next=function(){l()};var k=function(){b.$broadcast("slideBox.prevSlide")},l=function(){b.$broadcast("slideBox.nextSlide")},m=function(a){return console.log("received event: ",a),37===a.keyCode?(k(),!1):39===a.keyCode?(l(),!1):!0},n=function(){c.title="Deck "+b.deck;var a=[];c.rightButtons=[],2!==b.deck&&a.push({type:"button-clear",content:'<i class="icon icon-arrow-left4"></i>',tap:function(){return k(),!1}}),15===b.deck?a.push({type:"button-clear",content:'<i class="icon icon-blank"></i>',tap:function(){}}):a.push({type:"button-clear",content:'<i class="icon icon-arrow-right4"></i>',tap:function(){return l(),!1}}),c.rightButtons=a};b.$on("slideBox.slideChanged",function(a,c){b.deck=c+2,n(),e.transitionTo("deck-plans",{deck:b.deck},{location:!0,inherit:!0,notify:!1,reload:!1})}),d(function(){2!==b.deck?b.$broadcast("slideBox.setSlide",b.deck-2):n()},10),document.addEventListener("keydown",m,!0),b.$on("$destroy",function(){document.removeEventListener("keydown",m,!0)})}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Events",["cruisemonkey.User","cruisemonkey.Events","cruisemonkey.Logging","ionic","angularLocalStorage"]).filter("orderByEvent",function(){return function(a,b){if(!angular.isObject(a))return a;var c=[];for(var d in a){var e=a[d];e.setNewDay(!1),e.matches(b)&&c.push(e)}var f,g;c.sort(function(a,b){return f=a.getStart(),g=b.getStart(),f.isBefore(g)?-1:f.isAfter(g)?1:(f=a.getSummary().toLowerCase(),g=b.getSummary().toLowerCase(),f>g?1:g>f?-1:(f=a.end,g=b.end,f.isBefore(g)?-1:f.isAfter(g)?1:0))});var h,i;angular.forEach(c,function(a,b){a.setNewDay(!1),i=a.getStart(),0===b?a.setNewDay(!0):i.isAfter(h,"day")&&a.setNewDay(!0),h=i});for(var j=0;j<c.length;j++)0===j&&c[j].setNewDay(!0);return c}}).controller("CMEditEventCtrl",["$q","$scope","$rootScope","$modal","UserService","LoggingService",function(a,b,c,d,e,f){if(f.info("Initializing CMEditEventCtrl"),c.editEvent)b.event=c.editEvent.toEditableBean(),delete c.editEvent,f.info("Found existing event to edit."),console.log(b.event);else{var g=new CMEvent;g.setStart(moment()),g.setEnd(g.getStart().add("hours",1)),g.setUsername(e.getUsername()),g.setPublic(!0),b.event=g.toEditableBean(),f.info("Created fresh event."),console.log(b.event)}}]).controller("CMEventCtrl",["storage","$scope","$rootScope","$timeout","$stateParams","$location","$q","Modal","$templateCache","UserService","EventService","LoggingService",function(a,b,c,d,e,f,g,h,i,j,k,l){if(l.info("Initializing CMEventCtrl"),c.eventType=e.eventType,console.log("eventType=",c.eventType),!c.eventType)return f.path("/events/official"),void 0;a.bind(b,"searchString",{storeName:"cm.event."+c.eventType}),l.info("$scope.searchString: "+b.searchString),c.title=c.eventType.capitalize()+" Events";var m=function(){l.info("CMEventCtrl.refreshEvents()"),"official"===c.eventType?g.when(k.getOfficialEvents()).then(function(a){c.events=a,b.$broadcast("scroll.resize")}):"unofficial"===c.eventType?g.when(k.getUnofficialEvents()).then(function(a){c.events=a,b.$broadcast("scroll.resize")}):"my"===c.eventType?g.when(k.getMyEvents()).then(function(a){c.events=a,b.$broadcast("scroll.resize")}):l.warn("CMEventCtrl: unknown event type: "+c.eventType)};b.clearSearchString=function(){b.searchString=void 0},b.prettyDate=function(a){return a?a.format("dddd, MMMM Do"):void 0},b.fuzzy=function(a){return a?a.fromNow():void 0},b.justTime=function(a){return a?a.format("hh:mma"):void 0},b.trash=function(a){b.safeApply(function(){g.all([k.removeEvent(a),b.events]).then(function(a){var b=a[0],c=a[1];console.log("removed = ",b.toString()),delete c[b.getId()]})})},b.edit=function(a){b.safeApply(function(){b.event=a,b.eventData=a.toEditableBean(),b.modal.show()})},b.onFavoriteChanged=function(a,c){if(l.info("CMEventCtrl.onFavoriteChanged("+a+", "+c+")"),c)k.addFavorite(a);else{for(var d=0;d<b.events;d++)b.events[d]._id===a&&b.events.splice(d,1);k.removeFavorite(a)}},b.onPublicChanged=function(a,c){console.log("onPublicChanged: ",a,c),a.setPublic(c),g.when(b.events).then(function(){k.updateEvent(a)})},c.$on("cm.eventUpdated",function(){m()}),c.$on("cm.eventDeleted",function(){m()}),d(function(){m()},0),h.fromTemplateUrl("edit-event.html",function(a){b.modal=a},{scope:b,animation:"slide-in-up"}),b.cancelModal=function(){l.info("closing modal (cancel)"),b.event=void 0,b.eventData=void 0,b.modal.hide()},b.saveModal=function(a){l.info("closing modal (save)");var c=b.event;c.fromEditableBean(a),console.log("saving=",c.toEditableBean()),g.when(k.addEvent(c)).then(function(a){console.log("event added:",a),b.modal.hide()})};var n=[];j.getUsername()&&""!==j.getUsername()&&(n=[{type:"button-positive",content:'<i class="icon icon-add"></i>',tap:function(){var a=new CMEvent;a.setStart(moment()),a.setEnd(a.getEnd().add("hours",1)),a.setUsername(j.getUsername()),a.setPublic(!0),b.event=a,b.eventData=a.toEditableBean(),b.modal.show()}}]),c.rightButtons=n}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Header",["cruisemonkey.Logging"]).controller("CMHeaderCtrl",["$scope","$rootScope","$location","LoggingService",function(a,b,c,d){d.info("Initializing CMHeaderCtrl")}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Login",["cruisemonkey.Logging","cruisemonkey.User","cruisemonkey.Config","cruisemonkey.Settings"]).controller("CMLoginCtrl",["$scope","$rootScope","$location","$http","UserService","LoggingService","SettingsService",function(a,b,c,$http,d,e,f){e.info("Initializing CMLoginCtrl"),b.title="Log In",b.user=d.get(),a.goToTwitarr=function(){var a=f.getTwitarrRoot();window.open(a,"_system")},a.isUnchanged=function(a){var b=d.get();return null===b||void 0===b?null===a||void 0===a?!0:!1:b.username===a.username&&b.password===a.password},a.cancel=function(){b.user={},b.$broadcast("cm.loggedOut"),c.path("/events/official")},b.rightButtons=[{type:"button-positive",content:"Cancel",tap:function(){a.cancel()}}],a.update=function(g){f.getTwitarrRoot(),$http({method:"GET",url:a.twitarrRoot+"/api/v1/user/auth",params:{username:g.username,password:g.password},cache:!1,timeout:5e3,headers:{Accept:"application/json"}}).success(function(a){console.log("success:",a),g.loggedIn=!0,e.info("saving user"),console.log(g),d.save(g),b.user=d.get(),b.$broadcast("cm.loggedIn"),c.path("/events/my")}).error(function(a,c,d,e){console.log("failure!"),console.log("data:",a),console.log("status:",c),console.log("headers:",d),console.log("config:",e),b.isPhonegap?navigator.notification.alert("Failed to log in to twit-arr!",function(){}):window.alert("Failed to log in to twit-arr!")})}}])}(),function(){"use strict";angular.module("cruisemonkey.controllers.Logout",["cruisemonkey.Logging","cruisemonkey.User"]).controller("CMLogoutCtrl",["$scope","$rootScope","$routeParams","$location","UserService","LoggingService",function(a,b,c,d,e,f){f.info("Initializing CMLogoutCtrl"),b.title="Logging Out",b.user=e.reset(),d.replace(),d.path("/events/official")}])}(),function(){"use strict";angular.module("cruisemonkey.Navigation",["cruisemonkey.Logging"]).controller("CMNavigationCtrl",["$rootScope","$scope","$location","$document","UserService","LoggingService","$mobileFrame",function(a,b,c,d,e,f,g){f.info("Initializing CMNavigationCtrl"),b.toggleDrawer=function(){return g.navVisible()&&g.toggleNav(),!0}}])}(),function(){"use strict";angular.module("cruisemonkey.Database",["cruisemonkey.Logging","cruisemonkey.Config","cruisemonkey.Settings","angularLocalStorage"]).factory("Database",["$location","$interval","$timeout","$rootScope","$window","LoggingService","storage","config.database.replicate","SettingsService",function(a,b,c,d,e,f,g,h,i){f.info("Initializing CruiseMonkey database: "+i.getDatabaseName()),g.bind(d,"_seq",{defaultValue:0,storeName:"cm.db.sync"}),f.info("last sequence: "+d._seq);var j=function(){var b=i.getDatabaseHost();return b||(b=a.host()),"http://"+i.getDatabaseHost()+":5984/"+i.getDatabaseName()},k=null,l=null,m=!1,n=function(){k=new Pouch(i.getDatabaseName()),l=null,m=!1,k.compact(),f.info("Database.initializeDatabase(): Database initialization complete."),d.$broadcast("cm.databaseInitialized")},o=function(){if(!m){m=!0,f.info("Watching for document changes.");var a=d._seq;a||(a=0),k.changes({since:a,onChange:function(a){console.log("change: ",a),a.seq&&(d._seq=a.seq),a.deleted?d.$broadcast("cm.documentDeleted",a):d.$broadcast("cm.documentUpdated",a.doc)},continuous:!0,include_docs:!0}),f.info("Database.databaseReady(): Database ready for change updates."),d.$broadcast("cm.databaseReady")}},p=function(){f.info("Attempting to replicate with "+j()),d.$broadcast("cm.replicationStarting"),k.replicate.from(j(),{complete:function(){k.replicate.to(j(),{complete:function(){f.debug("Replication complete."),d.$broadcast("cm.replicationComplete")}})}})},q=function(){return h?null!==l?(f.warn("Replication has already been started!  Timeout ID = "+l),!1):(f.info("Enabling replication with "+j()),l=b(function(){p()},1e4),p(),!0):(f.warn("startReplication() called, but replication is not enabled!"),!1)},r=function(){return h?null!==l?(f.info("Stopping replication with "+j()),b.cancel(l),l=null,!0):(f.info("Replication is already stopped!"),!1):(f.warn("stopReplication() called, but replication is not enabled!"),void 0)},s=function(a){void 0!==navigator.connection.type?(console.log("Connection type is: "+navigator.connection.type),navigator.connection.type===Connection.NONE?r():q()):void 0!==navigator.connection.bandwidth?(console.log("Connection bandwidth is: "+navigator.connection.bandwidth),navigator.connection.bandwidth>0?q():r()):(f.info("Got a connection type event."),console.log(a))},t=function(){c(function(){navigator&&navigator.connection?navigator.connection.addEventListener?(f.info("Database.setUp(): Browser has native navigator.connection support."),navigator.connection.addEventListener("change",s,!1),s()):(f.info("Database.setUp(): Browser does not have native navigator.connection support.  Trying with phonegap."),document.addEventListener("online",s,!1),document.addEventListener("offline",s,!1),s()):(f.warn("Database.setUp(): Unsure how to handle connection management; starting replication and hoping for the best."),q()),o()},0)},u=function(){r(),navigator&&navigator.connection&&navigator.connection.removeEventListener?navigator.connection.removeEventListener("change",s,!1):(document.removeEventListener("online",s,!1),document.removeEventListener("offline",s,!1))},v=function(){d.safeApply(function(){u(),m=!1,d._seq=0,Pouch.destroy(i.getDatabaseName(),function(a){a?e.alert("Failed to destroy existing database!"):(f.info("Reloading CruiseMonkey."),e.location.reload())})})};return n(),t(),{reset:v,database:k,startReplication:q,stopReplication:r}}])}();var dateStringFormat="YYYY-MM-DD HH:mm";Modernizr.inputtypes["datetime-local"]&&(dateStringFormat="YYYY-MM-DDTHH:mm"),function(){"use strict";angular.module("cruisemonkey.Events",["cruisemonkey.Config","cruisemonkey.Database","cruisemonkey.User","cruisemonkey.Logging"]).factory("EventService",["$q","$rootScope","$timeout","$http","$location","Database","UserService","LoggingService","config.database.host","config.database.name","config.database.replicate",function(a,b,c,$http,d,e,f,g,h,i,j){g.info("EventService: Initializing EventService.");var k=a.defer(),l={},m={},n=[],o=function(a){g.debug("EventService.storeEvent("+a.getId()+")"),l[a.getId()]=a},p=function(a){delete l[a]},q=function(a){m[a.getId()]=a},r=function(a){delete m[a]},s=function(a){return l[a]},t=function(a){var b=f.getUsername();if(!b)return g.debug("EventService.getFavoriteByEventId(): Not logged in."),void 0;var c=s(a);if(c&&c.isFavorite())return c.getFavorite();var d;return angular.forEach(m,function(b){return b.getEventId()===a?(d=b,!1):void 0}),d},u=function(a){return m[a]},v=function(a,c){var d;d=a instanceof CMEvent?a:new CMEvent(a),g.debug("EventService.handleEventUpdated(): Event updated: "+d.toString());var e=t(d.getId());d.setFavorite(e),e&&e.setEvent(d),o(d),"undefined"!=typeof c&&c||b.$broadcast("cm.eventUpdated",d)},w=function(a,c){var d;d=a instanceof CMFavorite?a:new CMFavorite(a),g.debug("EventService.handleFavoriteUpdated(): Updating favorite: "+d.toString());var e=f.getUsername();if(!e)return g.warning("EventService.handleFavoriteUpdated(): user is not logged in!"),void 0;if(e!==d.getUsername())return g.warning("EventService.handleFavoriteUpdated(): favorite does not belong to "+e+"!"),void 0;var h=s(d.getEventId());d.setEvent(h),h?h.setFavorite(d):g.warning("EventService.handleFavoriteUpdated(): favorite "+d.getId()+" updated, but event "+d.getEventId()+" not found."),q(d),"undefined"!=typeof c&&c||(h&&b.$broadcast("cm.eventUpdated",h),b.$broadcast("cm.favoriteUpdated",d))},x=function(a,c){g.debug("EventService.handleEventDeleted(): Event "+a+" deleted.");var d=s(a);if(d&&d.isFavorite()){var e=d.getFavorite();r(e.getId())}p(a),"undefined"!=typeof c&&c||b.$broadcast("cm.eventDeleted",d)},y=function(a,c){g.debug("EventService.handleFavoriteDeleted("+a+")");var d=u(a);if(d){var e=d.getEvent();e&&(e.setFavorite(void 0),"undefined"!=typeof c&&c||b.$broadcast("cm.eventUpdated",e)),r(a)}else g.warn("EventService.handleFavoriteDeleted(): no favorite with id "+a+" found.")},z=function(c,d,f){var h=a.defer();return e.database.query({map:d},f,function(a,d){b.$apply(function(){if(a)g.error(a),h.reject(a);else{var b,e=[];for(b=0;b<d.total_rows;b++){var f=d.rows[b].value;e.push(new c(f))}g.debug("results =",e),h.resolve(e)}})}),h.promise},A=function(c){var d=a.defer();return setTimeout(function(){b.$apply(function(){d.resolve(c)})},0),d.promise},B=function(c){var d;d=c instanceof CMEvent?c:new CMEvent(c);var f=a.defer();return a.when(k.promise).then(function(){d.getUsername()?(g.info('EventService.addEvent(): posting event "'+d.getSummary()+'" for user "'+d.getUsername()+'"'),e.database.post(d.getRawData(),function(a,c){b.$apply(function(){a?(g.error(a),f.reject(a)):(d.setId(c.id),d.setRevision(c.rev),g.info("eventToAdd: "+d.toString()),v(d),f.resolve(d))})})):(g.info("EventService.addEvent(): no username in the event!"),f.reject("no username specified"))}),f.promise},C=function(c){var d,f=a.defer();return d=c instanceof CMEvent?c:new CMEvent(c),d.getRevision()&&d.getId()?(a.when(k.promise).then(function(){e.database.put(d.getRawData(),function(a,c){b.$apply(function(){a?(g.error(a),f.reject(a)):(d.setRevision(c.rev),v(d),f.resolve(d))})})}),f.promise):(g.warn("EventService.updateEvent(): Attempting to update event "+d.summary+", but it is missing _rev or _id!"),f.reject("bad event"),f.promise)},D=function(c){var d;d=c instanceof CMEvent?c.getRawData():c,g.info("EventService.removeEvent("+d._id+")");var f=a.defer();return a.when(k.promise).then(function(){e.database.remove(d,function(a,c){b.$apply(function(){a?(g.error(a),f.reject(a)):(x(d._id),f.resolve(c))})})}),f.promise},E=function(b){var c=a.defer();return a.when(k.promise).then(function(){c.resolve(l[b])}),c.promise},F=function(){return g.info("EventService.getAllEvents()"),z(CMEvent,function(a){"event"===a.type&&emit(a.username,a)},{reduce:!0})},G=function(){return g.info("EventService.getAllFavorites()"),z(CMFavorite,function(a){"favorite"===a.type&&emit(a.username,a)},{reduce:!0})},H=function(){g.info("EventService.getOfficialEvents()");var b=a.defer();return a.when(k.promise).then(function(){var a=[];angular.forEach(l,function(b){"official"===b.getUsername()&&a.push(b)}),b.resolve(a)},function(a){g.error("EventService.getOfficialEvents(): error = "+a)}),b.promise},I=function(){g.info("EventService.getUnofficialEvents()");var b=a.defer();return a.when(k.promise).then(function(){var a=[];angular.forEach(l,function(b){b.isPublic()&&"official"!==b.getUsername()&&a.push(b)}),b.resolve(a)}),b.promise},J=function(){g.info("EventService.getUserEvents()");var b=f.getUsername();if(!b)return g.warn("EventService.getUserEvent(): user not logged in"),A([]);var c=a.defer();return a.when(k.promise).then(function(){var a=[];angular.forEach(l,function(c){c.getUsername()===b&&a.push(c)}),c.resolve(a)}),c.promise},K=function(){g.info("EventService.getMyEvents()");var b=f.getUsername();if(!b)return g.warn("EventService.getMyEvents(): user not logged in"),A([]);var c=a.defer();return a.when(k.promise).then(function(){var a=[];angular.forEach(l,function(c){return c.getUsername()===b?(a.push(c),void 0):c.isFavorite()?(a.push(c),void 0):void 0}),c.resolve(a)}),c.promise},L=function(){var b=f.getUsername();if(!b)return g.warn("EventService.getMyFavorites(): user not logged in"),A([]);var c=a.defer();return a.when(k.promise).then(function(){var a=[];angular.forEach(m,function(c){c.getUsername()===b&&a.push(c.eventId)}),c.resolve(a)}),c.promise},M=function(b){var c=f.getUsername();if(!c)return g.warn("EventService.isFavorite(): user not logged in"),A(!1);var d=a.defer();return a.when(k.promise).then(function(){var a=s(b);d.resolve(a.isFavorite())}),d.promise},N=function(c){g.info("EventService.addFavorite("+c+")");var d=f.getUsername();if(!d||!c)return g.warn("EventService.addFavorite(): user not logged in, or no eventId passed"),A(void 0);var h=a.defer(),i={type:"favorite",username:d,eventId:c};return e.database.post(i,function(a,c){b.$apply(function(){a?(g.error(a),h.reject(a)):(i._id=c.id,i._rev=c.rev,w(i),h.resolve(i))})}),h.promise},O=function(c){g.info("EventService.removeFavorite("+c+")");var d=f.getUsername();if(!d||!c)return g.warn("EventService.removeFavorite(): user not logged in, or no eventId passed"),A(void 0);var h=a.defer();return e.database.query({map:function(a){"favorite"===a.type&&emit({username:a.username,eventId:a.eventId},a._id)}},{reduce:!0,include_docs:!0,key:{username:d,eventId:c}},function(c,d){b.$apply(function(){if(c)g.error(c),h.reject(c);else if(d.total_rows>0){var f=[];angular.forEach(d.rows,function(c){var d=a.defer();f.push(d.promise);var h=c.value,i=c.doc;e.database.remove(i,function(a,c){b.$apply(function(){a?(g.error(a),d.reject(a)):(y(h),d.resolve(c))})})}),a.all(f).then(function(){h.resolve(d.total_rows)},function(a){h.reject(a)})}else h.resolve(d.total_rows)})}),h.promise},P=function(){h||(h=d.host());var b="http://"+h+":5984/"+i,e=a.defer();return j?$http.get(b+"/_all_docs?include_docs=true",{headers:{Accept:"application/json"}}).success(function(a){e.resolve(a)}).error(function(a,b){g.error("EventService.getRemoteDocs(): failed to get all_docs from remote host = ",b),e.reject(b)}):c(function(){g.info("EventService.getRemoteDocs(): replication disabled, resolving with empty object"),e.resolve({})}),e.promise},Q=function(){a.all([F(),G(),P()]).then(function(a){g.info("EventService.initEventCache(): Retrieved events & favorites from the database; pushing to cache.");var b=a[0],c=a[1],d=a[2];if(angular.forEach(b,function(a){v(a)}),angular.forEach(c,function(a){w(a)}),d&&d.total_rows){g.info("EventService.initEventCache(): remote =",d);for(var e=0;e<d.total_rows;e++){var f=d.rows[e].doc;if("event"===f.type){var h=f;delete h.isFavorite,delete h.isNewDay,v(h)}else if("favorite"===f.type){var i=f;w(i)}}}k.resolve(!0),g.info("EventService.initEventCache(): finished initializing.")}),b.$on("cm.documentUpdated",function(a,b){b instanceof CMEvent?v(b):b instanceof CMFavorite?w(b):"event"===b.type?v(b):"favorite"===b.type?w(b):console.log("unhandled document update:",b)}),b.$on("cm.documentDeleted",function(a,b){if(b instanceof CMEvent)x(b.getId());else if(b instanceof CMFavorite)y(b.getId());else{var c=s(b.id);if(c)return x(c.getId()),void 0;var d=u(b.id);if(d)return y(d.getId()),void 0;console.log("unhandled document deletion:",b)}})};return b.$on("$destroy",function(){angular.forEach(n,function(a){a()})}),b.$on("cm.databaseReady",function(){g.info("EventService: Initializing caches."),Q()}),{_reinit:Q,addEvent:B,updateEvent:C,removeEvent:D,getEvent:E,getAllEvents:F,getOfficialEvents:H,getUnofficialEvents:I,getUserEvents:J,getMyEvents:K,getMyFavorites:L,isFavorite:M,addFavorite:N,removeFavorite:O}}])}(),function(){"use strict";function a(){}function b(){}a.prototype=new log4javascript.Appender,a.prototype.layout=new log4javascript.NullLayout,a.prototype.threshold=log4javascript.Level.DEBUG,a.prototype._saLogHistory="",a.prototype._saIndentLevel=0,a.prototype._getPrefix=function(){for(var a="",b=0;b<this._saIndentLevel;b++)a+=" ";return a},a.prototype._increaseIndentLevel=function(){this._saIndentLevel+=2},a.prototype._decreaseIndentLevel=function(){this._saIndentLevel-=2,this._saIndentLevel<0&&(this._saIndentLevel=0)},a.prototype._resetLogHistory=function(){this._saLogHistory="",this._saIndentLevel=0},a.prototype._addToLogHistory=function(a){void 0===this._saLogHistory?this._saLogHistory=this._getPrefix()+a+"\n":this._saLogHistory+=this._getPrefix()+a+"\n"},a.prototype.getLogHistory=function(){return this._saLogHistory||""},a.prototype.append=function(a){var b=this,c=function(){var c=b.getLayout(),d=c.format(a);return c.ignoresThrowable()&&a.exception&&(d+=a.getThrowableStrRep()),d};b._addToLogHistory(c())},a.prototype.group=function(a){this._addToLogHistory("=== "+a+" ==="),this._increaseIndentLevel()},a.prototype.groupEnd=function(){this._decreaseIndentLevel()},a.prototype.toString=function(){return"StringAppender"},b.prototype=new log4javascript.Appender,b.prototype.layout=new log4javascript.NullLayout,b.prototype.threshold=log4javascript.Level.DEBUG,b.prototype.append=function(a){var b=this,c=function(){var c=b.getLayout(),d=c.format(a);return c.ignoresThrowable()&&a.exception&&(d+=a.getThrowableStrRep()),d};console.log(c())},b.prototype.group=function(a){console.group&&console.group(a)},b.prototype.groupEnd=function(){console.groupEnd&&console.groupEnd()},b.prototype.toString=function(){return"ConsoleAppender"},angular.module("cruisemonkey.Logging",["cruisemonkey.Config"]).factory("LoggingService",["config.logging.useStringAppender",function(c){console.log("initializing LoggingService");var d=log4javascript.getLogger();d.removeAllAppenders();var e={getLogHistory:function(){return""},trace:function(){d.trace(Array.prototype.slice.apply(arguments))},debug:function(){d.debug(Array.prototype.slice.apply(arguments))},info:function(){d.info(Array.prototype.slice.apply(arguments))},warn:function(){d.warn(Array.prototype.slice.apply(arguments))},warning:function(){d.warn(Array.prototype.slice.apply(arguments))},error:function(){d.error(Array.prototype.slice.apply(arguments))},fatal:function(){d.fatal(Array.prototype.slice.apply(arguments))}},f=new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} [%-5p] %m");if(c){console.log("initializing StringAppender");var g=new a;g.setLayout(f),d.addAppender(g),e.getLogHistory=function(){return g.getLogHistory()}}else console.log("skipping StringAppender");var h=new b;return h.setLayout(f),d.addAppender(h),e}])}(),function(){"use strict";angular.module("cruisemonkey.User",["angularLocalStorage"]).factory("UserService",["$rootScope","storage",function(a,b){return b.bind(a,"_user",{defaultValue:{loggedIn:!1,username:"",password:""},storeName:"cm.user"}),{loggedIn:function(){return a._user.loggedIn},getUsername:function(){return a._user.loggedIn&&a._user.username?a._user.username.toLowerCase():void 0},get:function(){return angular.copy(a._user)},matches:function(b){var c=a._user;return c&&(c=c.toLowerCase()),b&&(b=b.toLowerCase()),c===b},save:function(b){b.username=b.username.toLowerCase(),a._user=angular.copy(b)},reset:function(){return a._user={loggedIn:!1,username:"",password:""},a._user}}}])}(),function(){"use strict";angular.module("cruisemonkey",["ui.router","ionic","ngRoute","cruisemonkey.Config","cruisemonkey.controllers.About","cruisemonkey.controllers.Advanced","cruisemonkey.controllers.DeckList","cruisemonkey.controllers.Events","cruisemonkey.controllers.Header","cruisemonkey.controllers.Login","cruisemonkey.controllers.Logout","cruisemonkey.Database","cruisemonkey.Navigation","cruisemonkey.Events","cruisemonkey.User","btford.phonegap.ready"]).config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/events/official"),a.state("login",{url:"/login",templateUrl:"template/login.html",controller:"CMLoginCtrl"}).state("logout",{url:"/logout",templateUrl:"template/logout.html",controller:"CMLogoutCtrl"}).state("events",{url:"/events/:eventType",templateUrl:"template/event-list.html",controller:"CMEventCtrl"}).state("deck-plans",{url:"/deck-plans/:deck",templateUrl:"template/deck-plans.html",controller:"CMDeckListCtrl"}).state("about",{url:"/about",templateUrl:"template/about.html",controller:"CMAboutCtrl"}).state("advanced",{url:"/advanced",templateUrl:"template/advanced.html",controller:"CMAdvancedCtrl"})}]).run(["$rootScope","$location","$urlRouter","UserService","EventService","phonegapReady",function(a,b,c,d,e,f){a.safeApply=function(a){var b=this.$root.$$phase;"$apply"===b||"$digest"===b?a&&"function"==typeof a&&a():this.$apply(a)},a.isPhonegap=!1,f(function(){a.isPhonegap=!0,console.log("phonegap!")}),a.openLeft=function(){a.sideMenuController.toggleLeft()},a.$on("$locationChangeSuccess",function(e,f,g){return console.log("locationChangeSuccess:",e,f,g),a.user=d.get(),a.sideMenuController.close(),e.preventDefault(),d.loggedIn()?(c.sync(),angular.noop(),void 0):f.endsWith("/events")||f.endsWith("/events/")?(b.path("/events/official"),angular.noop(),void 0):f.endsWith("/events/my")?(b.path("/login"),angular.noop(),void 0):(c.sync(),angular.noop(),void 0)
}),a.$on("cm.loggedIn",function(){console.log("User logged in, refreshing menu.")}),a.$on("cm.loggedOut",function(){console.log("User logged out, refreshing menu.")}),a.hideSpinner=!0}])}();