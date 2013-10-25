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
		
		return {
			addEvent: function(ev) {
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
			},
			updateEvent: function(ev) {
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
			},
			removeEvent: function(ev) {
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
			},
			getAllEvents: function() {
				log.info('getAllEvents()');
				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.username, doc);
					}
				}, {reduce: false});
			},
			getOfficialEvents: function() {
				log.info('getOfficialEvents()');
				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.username, doc);
					}
				}, {reduce: false, key: 'official'});
			},
			getPublicEvents: function() {
				log.info('getPublicEvents()');
				return doQuery(function(doc) {
					if (doc.type === 'event' && doc.isPublic) {
						emit(doc.username, doc);
					}
				}, {reduce: false});
			},
			getUserEvents: function(username) {
				log.info('getUserEvents(' + username + ')');
				
				if (!username) {
					return [];
				}

				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.username, doc);
					}
				}, {reduce: false, key: username});
			},
			getMyEvents: function(username) {
				log.info('getMyEvents(' + username + ')');

				if (!username) {
					return [];
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
			},
			getMyFavorites: function(username) {
				if (!username) {
					return [];
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
			},
			isFavorite: function(username, eventId) {
				if (!username || !eventId) {
					return false;
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
			},
			addFavorite: function(username, eventId) {
				console.log('addFavorite(' + username + ',' + eventId + ')');
				if (!username || !eventId) {
					return null;
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
			},
			removeFavorite: function(username, eventId) {
				console.log('removeFavorite(' + username + ',' + eventId + ')');
				if (!username || !eventId) {
					return null;
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
			}
		};
	}]);

}());