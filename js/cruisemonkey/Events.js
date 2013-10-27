(function() {
	'use strict';

	angular.module('cruisemonkey.Events', ['cruisemonkey.Database', 'cruisemonkey.User', 'cruisemonkey.Logging'])
	.factory('EventService', ['$q', '$rootScope', 'Database', 'UserService', 'LoggingService', function($q, $rootScope, db, UserService, log) {
		var stringifyDate = function(date) {
			if (date === null || date === undefined) {
				return undefined;
			}
			return moment(date).format("YYYY-MM-DD HH:mm");
		};

		$rootScope._eventCache = {};
		var resetEventCache = function() {
			$rootScope._eventCache = {};
			getOfficialEvents();
			getPublicEvents();
			getMyEvents();
		};

		var updateEventCache = function(cacheKey, results) {
			$rootScope._eventCache[cacheKey] = results;
		};

		var wrapReturn = function(func, cacheKey) {
			if ($rootScope._eventCache.hasOwnProperty(cacheKey)) {
				log.info('cache hit: ' + cacheKey);
				return promisedResult($rootScope._eventCache[cacheKey]);
			} else {
				log.info('cache miss: ' + cacheKey);
				return func();
			}
		};

		/* invalidate the cache whenever documents are updated or the user logs in/out */
		$rootScope.$on('cm.documentDeleted', function() {
			resetEventCache();
		});
		$rootScope.$on('cm.documentUpdated', function() {
			resetEventCache();
		});
		$rootScope.$on('cm.loggedIn', function() {
			resetEventCache();
		});
		$rootScope.$on('cm.loggedOut', function() {
			resetEventCache();
		});

		var doQuery = function(map, options, cacheKey) {
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
						updateEventCache(cacheKey, results);
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
							resetEventCache();
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
						resetEventCache();
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
						resetEventCache();
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
			}, {reduce: false}, 'all');
		};

		var getOfficialEvents = function() {
			log.info('getOfficialEvents()');
			return doQuery(function(doc) {
				if (doc.type === 'event') {
					emit(doc.username, doc);
				}
			}, {reduce: true, key: 'official'}, 'official');
		};

		var getPublicEvents = function() {
			log.info('getPublicEvents()');
			return doQuery(function(doc) {
				if (doc.type === 'event' && doc.isPublic && doc.username !== 'official') {
					emit(doc.username, doc);
				}
			}, {reduce: true}, 'public');
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
			}, {reduce: false, key: username}, 'user');
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
							if (entry.value.type === 'favorite') {
								entry.doc.isFavorite = true;
							}
							results.push(entry.doc);
						}
						updateEventCache('my', results);
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
						updateEventCache('favorites', results);
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
						resetEventCache();
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
										resetEventCache();
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

		return {
			'addEvent': addEvent,
			'updateEvent': updateEvent,
			'removeEvent': removeEvent,
			'getAllEvents': function() { return wrapReturn(getAllEvents, 'all'); },
			'getOfficialEvents': function() { return wrapReturn(getOfficialEvents, 'official'); },
			'getPublicEvents': function() { return wrapReturn(getPublicEvents, 'public'); },
			'getUserEvents': function() { return wrapReturn(getUserEvents, 'user'); },
			'getMyEvents': function() { return wrapReturn(getMyEvents, 'my'); },
			'getMyFavorites': getMyFavorites,
			'isFavorite': isFavorite,
			'addFavorite': addFavorite,
			'removeFavorite': removeFavorite
		};
	}]);

}());