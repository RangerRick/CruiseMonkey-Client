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

		var _doQuery = function(map, options) {
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

		var _promisedResult = function(res) {
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
			return _doQuery(function(doc) {
				if (doc.type === 'event') {
					emit(doc.username, doc);
				}
			}, {reduce: false});
		};

		var getOfficialEvents = function() {
			log.info('getOfficialEvents()');
			return _doQuery(function(doc) {
				if (doc.type === 'event') {
					emit(doc.username, doc);
				}
			}, {reduce: true, key: 'official'});
		};

		var getPublicEvents = function() {
			log.info('getPublicEvents()');
			return _doQuery(function(doc) {
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
				return _promisedResult([]);
			}

			return _doQuery(function(doc) {
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
				return _promisedResult([]);
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
				return _promisedResult([]);
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
				return _promisedResult(false);
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
				return _promisedResult(undefined);
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
				return _promisedResult(undefined);
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
						console.log(res);
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
							console.log('no favorites found');
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
			'getAllEvents': getAllEvents,
			'getOfficialEvents': getOfficialEvents,
			'getPublicEvents': getPublicEvents,
			'getUserEvents': getUserEvents,
			'getMyEvents': getMyEvents,
			'getMyFavorites': getMyFavorites,
			'isFavorite': isFavorite,
			'addFavorite': addFavorite,
			'removeFavorite': removeFavorite
		};
	}]);

}());