(function() {
	'use strict';

	if (typeof String.prototype.capitalize !== 'function') {
		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
		};
	}
	if (typeof String.prototype.startsWith !== 'function') {
		String.prototype.startsWith = function(str) {
			return this.lastIndexOf(str, 0) === 0;
		};
	}
	if (typeof String.prototype.endsWith !== 'function') {
		String.prototype.endsWith = function(suffix) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		};
	}
}());

(function() {
	'use strict';

	angular.module('cruisemonkey.Config', [])
	.value('config.logging.useStringAppender', false)
	.value('config.database.host', 'cm.raccoonfink.com')
	.value('config.database.name', 'cruisemonkey')
	.value('config.database.replicate', true)
	.value('config.app.version', '3.90');
}());

(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.About', ['cruisemonkey.Logging', 'cruisemonkey.Config'])
	.controller('CMAboutCtrl', ['$scope', '$rootScope', 'LoggingService', 'config.app.version', function($scope, $rootScope, log, version) {
		log.info('Initializing CMAboutCtrl');
		$rootScope.title = 'About CruiseMonkey ' + version;
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.DeckList', ['ngRoute', 'cruisemonkey.Logging', 'hammer'])
	.controller('CMDeckListCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'LoggingService', function($scope, $rootScope, $routeParams, $location, log) {
		log.info('Initializing CMDeckListCtrl');
		$scope.deck = parseInt($routeParams.deck, 10);
		$rootScope.title = "Deck " + $scope.deck;

		$scope.previous = function() {
			previous();
		};
		$scope.next = function() {
			next();
		};

		var previous = function() {
			$scope.safeApply(function() {
				if ($scope.deck !== 2) {
					var newdeck = ($scope.deck - 1);
					log.info('previous() going down to deck ' + newdeck);
					$location.path('/deck-plans/' + newdeck);
				}
			});
		};
		var next = function() {
			$scope.safeApply(function() {
				if ($scope.deck !== 15) {
					var newdeck = ($scope.deck + 1);
					log.info('next() going up to deck ' + newdeck);
					$location.path('/deck-plans/' + newdeck);
				}
			});
		};
		var listener = function(ev) {
			console.log("received event: ", ev);
			if (ev.keyCode === 37) {
				previous();
				return false;
			} else if (ev.keyCode === 39) {
				next();
				return false;
			}
			return true;
		};

		$rootScope.actions = [];
		if ($scope.deck != 2) {
			$rootScope.actions.push({
				'name': 'Previous',
				'iconClass': 'arrow-left4',
				'launch': function() {
					previous();
				}
			});
		}
		if ($scope.deck == 15) {
			$rootScope.actions.push({
				'name': 'Blank',
				'iconClass': 'blank',
				'launch': function() {
				}
			});
		} else {
			$rootScope.actions.push({
				'name': 'Next',
				'iconClass': 'arrow-right4',
				'launch': function() {
					next();
				}
			});
		}

		document.addEventListener('keydown', listener, true);
		$scope.$on('$destroy', function() {
			document.removeEventListener('keydown', listener, true);
		});
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Events', ['ngRoute', 'cruisemonkey.User', 'cruisemonkey.Events', 'cruisemonkey.Logging', 'ui.bootstrap.modal'])
	.filter('orderObjectBy', function() {
		return function(input, attribute) {
			if (!angular.isObject(input)) return input;
			if (!angular.isArray(attribute)) attribute = [attribute];

			var array = [];
			for(var objectKey in input) {
				array.push(input[objectKey]);
			}

			array.sort(function(a,b) {
				for (var i = 0; i < attribute.length; i++) {
					var attr = attribute[i];
					if (attr === 'start' || attr === 'end' || angular.isDate(a[attr]) || angular.isDate(b[attr])) {
						var ad = moment(a[attr]),
							bd = moment(b[attr]);
						if (ad.isBefore(bd)) return -1;
						if (ad.isAfter(bd)) return 1;
					} else if (angular.isNumber(a[attr]) || angular.isNumber(b[attr])) {
						if (a[attr] > b[attr]) return 1;
						if (a[attr] < b[attr]) return -1;
					} else {
						var alc = String(a[attr]).toLowerCase(),
							blc = String(b[attr]).toLowerCase();
						if (alc > blc) return 1;
						if (alc < blc) return -1;
					}
				}
				return 0;
			});

			return array;
		};
	})
	.controller('CMEditEventCtrl', ['$q', '$scope', '$rootScope', '$modal', 'UserService', 'LoggingService', function($q, $scope, $rootScope, $modal, UserService, log) {
		log.info('Initializing CMEditEventCtrl');

		var format="YYYY-MM-DD HH:mm";
		if (Modernizr.inputtypes["datetime-local"]) {
			format="YYYY-MM-DDTHH:mm";
		}

		if ($rootScope.editEvent) {
			$scope.event = angular.copy($rootScope.editEvent);
			delete $rootScope.editEvent;

			$scope.event.start = moment($scope.event.start).format(format);
			$scope.event.end = moment($scope.event.end).format(format);

			log.info('Found existing event to edit.');
			console.log($scope.event);
		} else {
			var start = new Date();
			$scope.event = {
				'start':    moment(start).format(format),
				'end':      moment(new Date(start.getTime() + 60 * 60 * 1000)).format(format),
				'type':     'event',
				'username': UserService.getUsername(),
				'isPublic': true
			};
			log.info('Created fresh event.');
			console.log($scope.event);
		}
	}])
	.controller('CMEventCtrl', ['$scope', '$rootScope', '$timeout', '$routeParams', '$location', '$q', '$modal', '$templateCache', 'UserService', 'EventService', 'LoggingService', function($scope, $rootScope, $timeout, $routeParams, $location, $q, $modal, $templateCache, UserService, EventService, log) {
		log.info('Initializing CMEventCtrl');

		$rootScope.eventType = $routeParams.eventType;
		$rootScope.title = $routeParams.eventType.capitalize() + ' Events';

		EventService.init();

		$scope.fuzzy = function(date) {
			return moment(date).fromNow();
		};
		$scope.justTime = function(date) {
			return moment(date).format('HH:mm');
		};

		$scope.trash = function(ev) {
			$scope.safeApply(function() {
				$q.all([EventService.removeEvent(ev), $scope.events]).then(function(response) {
					var removed = response[0];
					var events  = response[1];
					console.log('removed = ', removed);
					delete events[removed.id];
				});
			});
		};
		
		$scope.edit = function(ev) {
			$scope.safeApply(function() {
				console.log('edit: ', ev);

				ev.start = moment(ev.start).format("YYYY-MM-DD HH:mm");
				ev.end   = moment(ev.end).format("YYYY-MM-DD HH:mm");
				$rootScope.editEvent = ev;

				var modalInstance = $modal.open({
					templateUrl:'edit-event.html',
					controller:'CMEditEventCtrl'
				});
				modalInstance.result.then(function(newEvent) {
					log.info("Save finished!");
					console.log(newEvent);
					$q.all([EventService.updateEvent(newEvent), $scope.events]).then(function(results) {
						var events = results[1];
						events[newEvent._id] = newEvent;
						log.info('Finished updating event.');
					});
				}, function() {
					log.warn("Add canceled!");
				});
			});
		};

		$scope.onFavoriteChanged = function(eventId, checked) {
			if (checked) {
				EventService.addFavorite(eventId);
			} else {
				EventService.removeFavorite(eventId);
			}
		};

		$scope.onPublicChanged = function(event, pub) {
			console.log('onPublicChanged: ', event, pub);
			event.isPublic = pub;
			$q.when($scope.events).then(function(events) {
				events[event._id].isPublic = pub;
				EventService.updateEvent(events[event._id]);
			});
		};

		$rootScope.actions = [];
		if (UserService.getUsername() && UserService.getUsername() !== '') {
			$rootScope.actions.push({
				'name': 'Add Event',
				'iconClass': 'add',
				'launch': function() {
					log.info('launching modal');
					var modalInstance = $modal.open({
						templateUrl:'edit-event.html',
						controller:'CMEditEventCtrl'
					});
					modalInstance.result.then(function(result) {
						log.info("Save finished!");
						console.log(result);
						$q.all([EventService.addEvent(result), $scope.events]).then(function(results) {
							var added = results[0];
							var events = results[1];
							events[added._id] = added;
						});
					}, function() {
						log.warn("Add canceled!");
					});
				}
			});
		}
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Header', ['cruisemonkey.Logging'])
	.controller('CMHeaderCtrl', ['$scope', '$rootScope', '$location', 'LoggingService', function($scope, $rootScope, $location, LoggingService) {
		LoggingService.info('Initializing CMHeaderCtrl');
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Login', ['cruisemonkey.Logging', 'cruisemonkey.User'])
	.controller('CMLoginCtrl', ['$scope', '$rootScope', '$location', 'UserService', 'LoggingService', function($scope, $rootScope, $location, UserService, log) {
		log.info('Initializing CMLoginCtrl');
		$rootScope.title = "Log In";

		$rootScope.user = UserService.get();

		$scope.isUnchanged = function(newUser) {
			var savedUser = UserService.get();
			if (savedUser === null || savedUser === undefined) {
				if (newUser === null || newUser === undefined) {
					return true;
				} else {
					return false;
				}
			}
			return savedUser.username === newUser.username && savedUser.password === newUser.password;
		};

		$scope.reset = function() {
			var user = UserService.get();
			log.info('resetting user: ', user);
			$rootScope.user = user;
			$rootScope.$broadcast('cm.loggedOut');
			$location.path('/events/official');
		};

		$scope.update = function(user) {
			if (user.username === 'official') {
				console.log('Attempt to log in as "official", skipping.');
				$location.path('/events/official');
				return;
			}
			user.loggedIn = true;
			log.info('saving user');
			console.log(user);
			UserService.save(user);
			$rootScope.user = UserService.get();
			$rootScope.$broadcast('cm.loggedIn');
			$location.path('/events/my');
		};
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Logout', ['cruisemonkey.Logging', 'cruisemonkey.User'])
	.controller('CMLogoutCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'UserService', 'LoggingService', function($scope, $rootScope, $routeParams, $location, UserService, log) {
		log.info('Initializing CMLogoutCtrl');
		$rootScope.title = "Logging Out";
		$rootScope.user = UserService.reset();

		$location.replace();
		$location.path('/events/official');
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.Navigation', ['cruisemonkey.Logging'])
	.controller('CMNavigationCtrl', ['$rootScope', '$scope', '$location', '$document', 'UserService', 'LoggingService', '$mobileFrame', function($rootScope, $scope, $location, $document, UserService, log, $mobileFrame) {
		log.info('Initializing CMNavigationCtrl');

		$scope.toggleDrawer = function() {
			if ($mobileFrame.navVisible()) {
				$mobileFrame.toggleNav();
			}
			return true;
		};
	}]);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.Database', ['cruisemonkey.Logging', 'cruisemonkey.Config', 'ngInterval', 'angularLocalStorage'])
	.factory('Database', ['$location', '$interval', '$timeout', '$rootScope', 'LoggingService', 'storage', 'config.database.host', 'config.database.name', 'config.database.replicate', function($location, $interval, $timeout, $rootScope, log, storage, databaseHost, databaseName, replicate) {
		log.info('Initializing CruiseMonkey database: ' + databaseName);

		var db = new Pouch(databaseName);
		var timeout = null,
			watchingChanges = false;

		db.compact();

		storage.bind($rootScope, '_seq', {
			'defaultValue': 0,
			'storeName': 'cm.db.sync'
		});
		console.log('last sequence: ' + $rootScope._seq);

		var databaseReady = function() {
			if (watchingChanges) {
				return;
			}

			watchingChanges = true;
			
			log.info('Watching for document changes.');
			var seq = $rootScope._seq;
			if (!seq) {
				seq = 0;
			}
			db.changes({
				since: seq,
				onChange: function(change) {
					console.log('change: ', change);
					if (change.seq) {
						$rootScope._seq = change.seq;
					}
					if (change.deleted) {
						$rootScope.$broadcast('cm.documentDeleted', change);
					} else {
						$rootScope.$broadcast('cm.documentUpdated', change.doc);
					}
				},
				continuous: true,
				include_docs: true
			});
			$rootScope.$broadcast('cm.databaseReady');
		};

		var startReplication = function() {
			if (replicate) {
				if (timeout !== null) {
					log.warn('Replication has already been started!  Timeout ID = ' + timeout);
					return false;
				} else {
					var doReplicate = function() {
						log.info('Attempting to replicate with ' + host);
						db.replicate.to(host, {
							'complete': function() {
								db.replicate.from(host, {
									'complete': function() {
										databaseReady();
									}
								});
							}
						});
					};

					if (!databaseHost) {
						databaseHost = $location.host();
					}
					var host = 'http://' + databaseHost + ':5984/cruisemonkey';
					log.info('Enabling replication with ' + host);

					timeout = $interval(function() {
						doReplicate();
					}, 10000);
					doReplicate();

					return true;
				}
			} else {
				log.warn('startReplication() called, but replication is not enabled!');
				registerForChanges();
			}
			return false;
		};

		var stopReplication = function() {
			if (replicate) {
				if (timeout !== null) {
					log.info('Stopping replication with ' + host);
					$interval.cancel(timeout);
					timeout = null;
					return true;
				} else {
					log.info('Replication is already stopped!');
					return false;
				}
			} else {
				log.warn('stopReplication() called, but replication is not enabled!');
			}
		};

		var handleConnectionTypeChange = function(ev) {
			if (navigator.connection.type !== undefined) {
				console.log('Connection type is: ' + navigator.connection.type);
				if (navigator.connection.type === Connection.NONE) {
					stopReplication();
				} else {
					startReplication();
				}
			} else if (navigator.connection.bandwidth !== undefined) {
				console.log('Connection bandwidth is: ' + navigator.connection.bandwidth);
				if (navigator.connection.bandwidth > 0) {
					startReplication();
				} else {
					stopReplication();
				}
			} else {
				log.info('Got a connection type event.');
				console.log(ev);
			}
		};

		$timeout(function() {
			if (navigator && navigator.connection) {
				if (navigator.connection.addEventListener) {
					log.info("Browser has native navigator.connection support.");
					navigator.connection.addEventListener('change', handleConnectionTypeChange);
					handleConnectionTypeChange();
				} else {
					log.info("Browser does not have native navigator.connection support.  Trying with phonegap.");
					document.addEventListener('online', handleConnectionTypeChange);
					document.addEventListener('offline', handleConnectionTypeChange);
					handleConnectionTypeChange();
				}
			} else {
				log.warn("Unsure how to handle connection management; starting replication and hoping for the best.");
				startReplication();
			}
		}, 10);

		log.info('Finished initializing CruiseMonkey database.');

		return {
			'database': db,
			'startReplication': startReplication,
			'stopReplication': stopReplication
		};
	}]);
}());

(function() {
	'use strict';

	angular.module('cruisemonkey.Events', ['cruisemonkey.Database', 'cruisemonkey.User', 'cruisemonkey.Logging'])
	.factory('EventService', ['$q', '$rootScope', '$timeout', 'Database', 'UserService', 'LoggingService', function($q, $rootScope, $timeout, db, UserService, log) {
		log.info('Initializing EventService.');

		var stringifyDate = function(date) {
			if (date === null || date === undefined) {
				return undefined;
			}
			return moment(date).format("YYYY-MM-DD HH:mm");
		};

		var _favorites = {};
		var _processedEvents = {};

		var listeners = [],
			databaseReady = false;

		var normalizeEvents = function(events) {
			var i, ret = {};
			for (i = 0; i < events.length; i++) {
				var e = events[i];
				if (e) {
					if (!e.hasOwnProperty('isFavorite')) {
						e.isFavorite = false;
					}
					ret[e._id] = e;
				} else {
					console.log('events = ', events);
					console.log('event ' + i + ' was undefined!');
				}
			}
			return ret;
		};

		var updateEventCache = function() {
			log.info('Events.updateEventCache(): eventType = ' + $rootScope.eventType);

			if (!_processedEvents[$rootScope.eventType]) {
				log.info('no processed events for type ' + $rootScope.eventType);
				return;
			}
			if (!$rootScope.events) {
				$rootScope.events = {};
			}

			var events = _processedEvents[$rootScope.eventType];

			angular.forEach(events, function(value, index) {
				$rootScope.events[index] = value;
			});
			angular.forEach($rootScope.events, function(value, index) {
				if (!events[index]) {
					delete $rootScope.events[index];
				}
			});
			$rootScope.$broadcast('cm.eventCacheUpdated');
		};

		var updateOfficialEventCache = function() {
			var deferred = $q.defer();
			$q.when(getOfficialEvents()).then(function(events) {
				_processedEvents.official = normalizeEvents(events);
				deferred.resolve(_processedEvents.official);
				updateEventCache();
			}, function(failure) {
				deferred.reject(failure);
			});
			return deferred.promise;
		};

		var updateUnofficialEventCache = function() {
			var deferred = $q.defer();
			$q.when(getUnofficialEvents()).then(function(events) {
				_processedEvents.unofficial = normalizeEvents(events);
				deferred.resolve(_processedEvents.unofficial);
				updateEventCache();
			}, function(failure) {
				deferred.reject(failure);
			});
			return deferred.promise;
		};

		var updateMyEventCache = function() {
			var deferred = $q.defer();
			$q.when(getMyEvents()).then(function(events) {
				_processedEvents.my = normalizeEvents(events);
				deferred.resolve(_processedEvents.my);
				updateEventCache();
			}, function(failure) {
				deferred.reject(failure);
			});
			return deferred.promise;
		};

		var updateAllCaches = function() {
			var deferred = $q.defer();
			$q.all([updateOfficialEventCache(), updateUnofficialEventCache(), updateMyEventCache()]).then(function(finished) {
				log.info('All caches updated.');
				deferred.resolve();
			}, function(failed) {
				deferred.reject(failed);
			});
			return deferred.promise;
		};

		var updateDocument = function(doc) {
			log.info('Events.updateDocument(' + doc._id + ')');
			var id = doc._id;

			if (doc.username === 'official') {
				doc.isPublic = true;
				if (!doc.isFavorite) {
					doc.isFavorite = false;
				}

				if (_processedEvents.official) {
					var existingOfficial = _processedEvents.official[id];
					if (existingOfficial) {
						doc.isFavorite = existingOfficial.isFavorite;
					}
				}

				log.debug('Events.updateDocument(): putting ' + id + ' in official events.');
				_processedEvents.official[id] = doc;
			}

			if (doc.isPublic && doc.username != 'official') {
				if (!doc.isFavorite) {
					doc.isFavorite = false;
				}

				if (_processedEvents.unofficial) {
					var existingUnofficial = _processedEvents.unofficial[id];
					if (existingUnofficial) {
						doc.isFavorite = existingUnofficial.isFavorite;
					}
				}

				log.debug('Events.updateDocument(): putting ' + id + ' in unofficial events.');
				_processedEvents.unofficial[id] = doc;
			}

			var myExisting;
			if (_processedEvents.my) {
				myExisting = _processedEvents.my[id];
			}
			if (doc.username === UserService.getUsername() || (myExisting && myExisting.isFavorite)) {
				if (myExisting) {
					doc.isFavorite = myExisting.isFavorite;
				}

				log.debug('Events.updateDocument(): putting ' + id + ' in my events.');
				_processedEvents.my[id] = doc;
			}

			updateEventCache();
		};

		var deleteDocument = function(doc) {
			log.info('Events.deleteDocument(' + doc.id + ')');
			var id = doc.id;
			if (_favorites[id]) {
				log.info(id + ' is a favorite.  Deleting the associated event (' + _favorites[id] + ')');
				id = _favorites[id];
				delete _favorites[id];
			}
			angular.forEach(_processedEvents, function(events, type) {
				if (events[id]) {
					log.debug('event[' + id + '] was found in type ' + type + ', deleting.');
					delete events[id];
				}
			});
		};

		var doQuery = function(map, options) {
			var deferred = $q.defer();
			db.database.query({map: map}, options, function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						var results = [], i;
						for (i = 0; i < res.total_rows; i++) {
							results.push(res.rows[i].value);
						}
						deferred.resolve(results);
					}
				});
			});
			return deferred.promise;
		};

		var promisedResult = function(res) {
			var deferred = $q.defer();
			setTimeout(function() {
				$rootScope.$apply(function() {
					deferred.resolve(res);
				});
			}, 0);
			return deferred.promise;
		};

		var addEvent = function(ev) {
			var eventToAdd = angular.copy(ev);

			eventToAdd.type = 'event';
			eventToAdd.start = stringifyDate(eventToAdd.start);
			eventToAdd.end = stringifyDate(eventToAdd.end);

			var deferred = $q.defer();

			if (!eventToAdd.username || eventToAdd.username === '') {
				log.info('addEvent(): no username in the event!');
				deferred.reject('no username specified');
			} else {
				log.info('addEvent(): posting event "' + eventToAdd.summary + '" for user "' + eventToAdd.username + '"');
				db.database.post(eventToAdd, function(err, response) {
					$rootScope.$apply(function() {
						if (err) {
							log.error(err);
							deferred.reject(err);
						} else {
							eventToAdd._id = response.id;
							eventToAdd._rev = response.rev;
							deferred.resolve(eventToAdd);
						}
					});
				});
			}

			return deferred.promise;
		};

		var updateEvent = function(ev) {
			var deferred = $q.defer();

			if (!ev._rev || !ev._id) {
				log.warn('Attempting to update event ' + ev.summary + ', but it is missing _rev or _id!');
				deferred.reject('bad event');
				return deferred.promise;
			}

			/* make a copy and strip out the user-specific isFavorite property */
			var eventToSave = angular.copy(ev);
			delete eventToSave.isFavorite;
			eventToSave.start = stringifyDate(eventToSave.start);
			eventToSave.end = stringifyDate(eventToSave.end);

			db.database.put(eventToSave, function(err, response) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						eventToSave._rev = response.rev;
						deferred.resolve(response);
					}
				});
			});
		};

		var removeEvent = function(ev) {
			log.info('removeEvent(' + ev._id + ')');
			var deferred = $q.defer();
			db.database.remove(ev, function(err, response) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						deferred.resolve(response);
					}
				});
			});
			return deferred.promise;
		};

		var getAllEvents = function() {
			log.info('getAllEvents()');
			return doQuery(function(doc) {
				if (doc.type === 'event') {
					emit(doc.username, doc);
				}
			}, {reduce: false});
		};

		var getOfficialEvents = function() {
			log.info('getOfficialEvents()');
			return doQuery(function(doc) {
				if (doc.type === 'event') {
					emit(doc.username, doc);
				}
			}, {reduce: true, key: 'official'});
		};

		var getUnofficialEvents = function() {
			log.info('getUnofficialEvents()');
			return doQuery(function(doc) {
				if (doc.type === 'event' && doc.isPublic && doc.username !== 'official') {
					emit(doc.username, doc);
				}
			}, {reduce: true});
		};

		var getUserEvents = function() {
			log.info('getUserEvents()');

			var username = UserService.getUsername();
			if (!username) {
				log.warn('getUserEvent(): user not logged in');
				return promisedResult([]);
			}

			return doQuery(function(doc) {
				if (doc.type === 'event') {
					emit(doc.username, doc);
				}
			}, {reduce: false, key: username});
		};

		var getMyEvents = function() {
			log.info('getMyEvents()');

			var username = UserService.getUsername();
			if (!username) {
				log.warn('getMyEvents(): user not logged in');
				return promisedResult([]);
			}

			var deferred = $q.defer();
			db.database.query(
			{
				map: function(doc) {
					if (doc.type === 'event') {
						emit(doc.username, {'_id': doc._id, 'type': doc.type});
					} else if (doc.type === 'favorite') {
						emit(doc.username, {'_id': doc.eventId, 'type': doc.type});
					}
				}
			},
			{
				reduce: true,
				include_docs: true,
				key: username
			},
			function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						var results = [], i, entry;
						for (i = 0; i < res.total_rows; i++) {
							entry = res.rows[i];
							if (entry.doc) {
								if (entry.value.type === 'favorite') {
									entry.doc.isFavorite = true;
								}
								results.push(entry.doc);
							}
						}
						deferred.resolve(results);
					}
				});
			});
			return deferred.promise;
		};

		var getMyFavorites = function() {
			var username = UserService.getUsername();
			if (!username) {
				log.warn('getMyFavorites(): user not logged in');
				return promisedResult([]);
			}

			var deferred = $q.defer();
			db.database.query(
			{
				map: function(doc) {
					if (doc.type === 'favorite') {
						emit(doc.username, doc.eventId);
					}
				}
			},
			{
				reduce: true,
				include_docs: false,
				key: username
			},
			function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						var results = [], i;
						for (i = 0; i < res.total_rows; i++) {
							results.push(res.rows[i].value);
						}
						deferred.resolve(results);
					}
				});
			});
			return deferred.promise;
		};

		var isFavorite = function(eventId) {
			var username = UserService.getUsername();
			if (!username || !eventId) {
				log.warn('isFavorite(): user not logged in, or no eventId passed');
				return promisedResult(false);
			}

			var deferred = $q.defer();
			db.database.query(
			{
				map: function(doc) {
					if (doc.type === 'favorite') {
						emit({ 'username': doc.username, 'eventId': doc.eventId });
					}
				}
			},
			{
				reduce: true,
				include_docs: false,
				key: { 'username': username, 'eventId': eventId }
			},
			function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						deferred.resolve(res.total_rows > 0);
					}
				});
			});
			return deferred.promise;
		};

		var addFavorite = function(eventId) {
			var username = UserService.getUsername();
			if (!username || !eventId) {
				log.warn('addFavorite(): user not logged in, or no eventId passed');
				return promisedResult(undefined);
			}

			var deferred = $q.defer();

			db.database.post({
				'type': 'favorite',
				'username': username,
				'eventId': eventId
			}, function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						deferred.resolve(res.id);
					}
				});
			});
			return deferred.promise;
		};

		var removeFavorite = function(eventId) {
			var username = UserService.getUsername();
			if (!username || !eventId) {
				log.warn('removeFavorite(): user not logged in, or no eventId passed');
				return promisedResult(undefined);
			}

			var deferred = $q.defer();
			db.database.query(
			{
				map: function(doc) {
					if (doc.type === 'favorite') {
						emit({ 'username': doc.username, 'eventId': doc.eventId }, doc._id);
					}
				}
			},
			{
				reduce: true,
				include_docs: true,
				key: { 'username': username, 'eventId': eventId }
			},
			function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						log.error(err);
						deferred.reject(err);
					} else {
						if (res.total_rows > 0) {
							var doc = res.rows[0].doc;
							db.database.remove(doc, function(err, res) {
								$rootScope.$apply(function() {
									if (err) {
										log.error(err);
										deferred.reject(err);
									} else {
										deferred.resolve(res);
									}
								});
							});
						} else {
							deferred.resolve(null);
						}
					}
				});
			});
			return deferred.promise;
		};

		var handleEvents = function(ev, doc) {
			log.trace('got event: ', ev);
			log.trace('document: ', doc);

			if (ev.name === 'cm.databaseReady') {
				// we've finished loading the database, prime the event cache
				updateAllCaches();
			} else if (ev.name === 'cm.documentUpdated') {
				updateDocument(doc);
			} else if (ev.name === 'cm.documentDeleted') {
				deleteDocument(doc);
			} else if (ev.name === 'cm.loggedIn' || ev.name === 'cm.loggedOut') {
				log.info('User login changed.  Resetting cache.');
				_processedEvents = {};
				updateAllCaches();
			} else {
				log.warn("Unhandled event type: " + ev.name);
			}
		};

		log.info('Initializing caches.');
		updateAllCaches().then(function() {
			/* invalidate the cache whenever things affect the model */
			angular.forEach(['cm.databaseReady', 'cm.documentDeleted', 'cm.documentUpdated', 'cm.loggedIn', 'cm.loggedOut'], function(value) {
				listeners.push($rootScope.$on(value, handleEvents));
			});
		});

		$rootScope.$on('$destroy', function() {
			angular.forEach(listeners, function(listener) {
				listener();
			});
		});

		return {
			'init': updateEventCache,
			'addEvent': addEvent,
			'updateEvent': updateEvent,
			'removeEvent': removeEvent,
			'getAllEvents': getAllEvents,
			'getOfficialEvents': getOfficialEvents,
			'getUnofficialEvents': getUnofficialEvents,
			'getUserEvents': getUserEvents,
			'getMyEvents': getMyEvents,
			'getMyFavorites': getMyFavorites,
			'isFavorite': isFavorite,
			'addFavorite': addFavorite,
			'removeFavorite': removeFavorite
		};
	}]);

}());
(function() {
	'use strict';

	function StringAppender() {}

	StringAppender.prototype = new log4javascript.Appender();
	StringAppender.prototype.layout = new log4javascript.NullLayout();
	StringAppender.prototype.threshold = log4javascript.Level.DEBUG;
	StringAppender.prototype._saLogHistory = "";
	StringAppender.prototype._saIndentLevel = 0;

	StringAppender.prototype._getPrefix = function() {
		var prefix = "";
		for (var i = 0; i < this._saIndentLevel; i++) {
			prefix += " ";
		}
		return prefix;
	};

	StringAppender.prototype._increaseIndentLevel = function() {
		this._saIndentLevel += 2;
	};

	StringAppender.prototype._decreaseIndentLevel = function() {
		this._saIndentLevel -= 2;
		if (this._saIndentLevel < 0) {
			this._saIndentLevel = 0;
		}
	};

	StringAppender.prototype._resetLogHistory = function() {
		this._saLogHistory  = "";
		this._saIndentLevel = 0;
	};

	StringAppender.prototype._addToLogHistory = function(message) {
		if (this._saLogHistory === undefined) {
			this._saLogHistory = this._getPrefix() + message + "\n";
		} else {
			this._saLogHistory += this._getPrefix() + message + "\n";
		}
	};

	StringAppender.prototype.getLogHistory = function() {
		return this._saLogHistory || "";
	};

	StringAppender.prototype.append = function(loggingEvent) {
		var appender = this;

		var getFormattedMessage = function() {
			var layout = appender.getLayout();
			var formattedMessage = layout.format(loggingEvent);
			if (layout.ignoresThrowable() && loggingEvent.exception) {
				formattedMessage += loggingEvent.getThrowableStrRep();
			}
			return formattedMessage;
		};

		appender._addToLogHistory(getFormattedMessage());
	};

	StringAppender.prototype.group = function(name) {
		this._addToLogHistory("=== " + name + " ===");
		this._increaseIndentLevel();
	};

	StringAppender.prototype.groupEnd = function() {
		this._decreaseIndentLevel();
	};

	StringAppender.prototype.toString = function() {
		return "StringAppender";
	};

	function ConsoleAppender() {}

	ConsoleAppender.prototype = new log4javascript.Appender();
	ConsoleAppender.prototype.layout = new log4javascript.NullLayout();
	ConsoleAppender.prototype.threshold = log4javascript.Level.DEBUG;

	ConsoleAppender.prototype.append = function(loggingEvent) {
		var appender = this;

		var getFormattedMessage = function() {
			var layout = appender.getLayout();
			var formattedMessage = layout.format(loggingEvent);
			if (layout.ignoresThrowable() && loggingEvent.exception) {
				formattedMessage += loggingEvent.getThrowableStrRep();
			}
			return formattedMessage;
		};

		console.log(getFormattedMessage());
	};

	ConsoleAppender.prototype.group = function(name) {
		if (console.group) {
			console.group(name);
		}
	};

	ConsoleAppender.prototype.groupEnd = function() {
		if (console.groupEnd) {
			console.groupEnd();
		}
	};

	ConsoleAppender.prototype.toString = function() {
		return "ConsoleAppender";
	};

	angular.module('cruisemonkey.Logging', ['cruisemonkey.Config'])
	.factory('LoggingService', ['config.logging.useStringAppender', function(useStringAppender) {
		console.log('initializing LoggingService');

		var logger = log4javascript.getLogger();
		logger.removeAllAppenders();

		var ret = {
			'getLogHistory': function() {
				return "";
			},
			'trace': function() {
				logger.trace(Array.prototype.slice.apply(arguments));
			},
			'debug': function() {
				logger.debug(Array.prototype.slice.apply(arguments));
			},
			'info': function() {
				logger.info(Array.prototype.slice.apply(arguments));
			},
			'warn': function() {
				logger.warn(Array.prototype.slice.apply(arguments));
			},
			'warning': function() {
				logger.warn(Array.prototype.slice.apply(arguments));
			},
			'error': function() {
				logger.error(Array.prototype.slice.apply(arguments));
			},
			'fatal': function() {
				logger.fatal(Array.prototype.slice.apply(arguments));
			}
		};

		var layout = new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} [%-5p] %m");
		if (useStringAppender) {
			console.log('initializing StringAppender');
			var stringAppender = new StringAppender();
			stringAppender.setLayout(layout);
			logger.addAppender(stringAppender);

			ret.getLogHistory = function() {
				return stringAppender.getLogHistory();
			};
		} else {
			console.log('skipping StringAppender');
		}

		var appender = new ConsoleAppender();
		appender.setLayout(layout);
		logger.addAppender(appender);

		return ret;
	}]);

}());
(function() {
	'use strict';

	angular.module('cruisemonkey.User', ['angularLocalStorage'])
	.factory('UserService', function($rootScope, storage) {
		storage.bind($rootScope, '_user', {
			'defaultValue': {
				'loggedIn': false,
				'username': '',
				'password': ''
			},
			'storeName': 'cm.user'
		});

		return {
			'loggedIn': function() {
				return $rootScope._user.loggedIn;
			},
			'getUsername': function() {
				if ($rootScope._user.loggedIn) {
					return $rootScope._user.username;
				} else {
					return undefined;
				}
			},
			'get': function() {
				return angular.copy($rootScope._user);
			},
			'save': function(newUser) {
				$rootScope._user = angular.copy(newUser);
			},
			'reset': function() {
				$rootScope._user = {
					'loggedIn': false,
					'username': '',
					'password': ''
				};
				return $rootScope._user;
			}
		};
	});

}());
(function() {
	'use strict';

	angular.module('cruisemonkey.directives', [])
	;
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.filters', []);
}());
(function() {
	'use strict';

	angular.module('cruisemonkey.services', [])
	.value('version', '3.90')
	;
}());
(function () {
	'use strict';

	angular.module('cruisemonkey',
	[
		'ngRoute',
		'cruisemonkey.filters',
		'cruisemonkey.services',
		'cruisemonkey.directives',
		'cruisemonkey.controllers.About',
		'cruisemonkey.controllers.DeckList',
		'cruisemonkey.controllers.Events',
		'cruisemonkey.controllers.Header',
		'cruisemonkey.controllers.Login',
		'cruisemonkey.controllers.Logout',
		'cruisemonkey.Database',
		'cruisemonkey.Navigation',
		'cruisemonkey.Events',
		'cruisemonkey.User',
		'ek.mobileFrame',
		'btford.phonegap.ready'
	])
	.config(['$routeProvider', '$mobileFrameProvider', function($routeProvider, $mobileFrameProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'template/login.html',
				controller: 'CMLoginCtrl'
			})
			.when('/logout', {
				templateUrl: 'template/logout.html',
				controller: 'CMLogoutCtrl'
			})
			.when('/events', {
				redirectTo: '/events/official/'
			})
			.when('/events/:eventType', {
				templateUrl: 'template/event-list.html',
				controller: 'CMEventCtrl' /*,
				resolve: {
					events: ['$q', '$route', '$timeout', 'EventService', 'LoggingService', function($q, $route, $timeout, EventService, log) {
						var func;
						var eventType = $route.current.params.eventType;
						if (eventType === 'official') {
							func = EventService.getOfficialEvents;
						} else if (eventType === 'unofficial') {
							func = EventService.getUnofficialEvents;
						} else if (eventType === 'my') {
							func = EventService.getMyEvents;
						} else {
							log.warn('unknown event type: ' + eventType);
						}

						var response = $q.defer();
						if (func) {
							$q.when(func()).then(function(events) {
								var i, ret = {};
								for (i = 0; i < events.length; i++) {
									var e = events[i];
									if (!e.hasOwnProperty('isFavorite')) {
										e.isFavorite = false;
									}
									ret[e._id] = e;
								}
								response.resolve(ret);
							});
						} else {
							$timeout(function() {
								response.reject('unknown event type');
							}, 0);
						}
						return response.promise;
					}]
				} */
			})
			.when('/deck-plans', {
				redirectTo: '/deck-plans/2/'
			})
			.when('/deck-plans/:deck', {
				templateUrl: 'template/deck-plans.html',
				controller: 'CMDeckListCtrl'
			})
			.when('/about', {
				templateUrl: 'template/about.html',
				controller: 'CMAboutCtrl'
			})
			.otherwise({
				redirectTo: '/events/official/'
			});
		$mobileFrameProvider
			.setHeaderHeight(40)
			.setFooterHeight(0)
			.setNavWidth(250);
	}])
	.run(['$rootScope', '$location', 'UserService', 'phonegapReady', function($rootScope, $location, UserService, phonegapReady) {
		$rootScope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if(phase === '$apply' || phase === '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		phonegapReady(function() {
			if (StatusBar) {
				console.log('StatusBar exists, isVisible = ' + StatusBar.isVisible);
				StatusBar.overlaysWebView(false);
				StatusBar.backgroundColorByName('black');
			}
		});

		$rootScope.$on('$routeChangeStart', function(event, currRoute, prevRoute) {
			$rootScope.actions = [];
			$rootScope.user = UserService.get();

			if (UserService.loggedIn()) {
				angular.noop();
				return;
			}

			if (currRoute.templateUrl === 'template/event-list.html' && currRoute.params.eventType === 'my') {
				event.preventDefault();
				$location.path('/login/');
				angular.noop();
				return;
			}

			if (prevRoute && prevRoute.access) {
				if (prevRoute.access.requiresLogin) {
					event.preventDefault();
					$location.path('/login/');
					angular.noop();
				}
			}

			angular.noop();
			return;
		});
		
		var updateMenu = function() {
			var path = $location.path();
			angular.forEach(document.getElementById('nav').children, function(li, key) {
				if (li.children[0]) {
					var href = li.children[0].href;
					if (href) {
						if (href.charAt(href.length - 1) === '/') {
							href = href.substr(0, href.length - 1);
						}
						var index = href.indexOf('#');
						if (index !== -1) {
							href = href.substring(href.indexOf('#') + 1);
						}
						if (href === '') {
							angular.element(li).removeClass('selected');
						} else if (path.startsWith(href)) {
							angular.element(li).addClass('selected');
						} else {
							angular.element(li).removeClass('selected');
						}
					}
				}
			});
		};

		$rootScope.$on('$routeChangeSuccess', function(event, currRoute, prevRoute) {
			updateMenu();
		});
		$rootScope.$on('cm.loggedIn', function(event) {
			console.log('User logged in, refreshing menu.');
			updateMenu();
		});
		$rootScope.$on('cm.loggedOut', function(event) {
			console.log('User logged out, refreshing menu.');
			updateMenu();
		});
		
		$rootScope.hideSpinner = true;
	}])
	;
}());