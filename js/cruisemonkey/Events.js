(function() {
	'use strict';

	angular.module('cruisemonkey.Events', ['cruisemonkey.Database', 'cruisemonkey.Logging'])
	.factory('EventService', ['$q', '$rootScope', 'Database', 'LoggingService', function($q, $rootScope, db, log) {
		var doQuery = function(map, options) {
			var deferred = $q.defer();
			db.query({map: map}, options, function(err, res) {
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
				db.query(
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
				db.query(
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
				db.query(
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
							console.log('isFavorite.res=', res);
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
				db.post({
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
				db.query(
				{
					map: function(doc) {
						if (doc.type === 'favorite') {
							console.log('emitting: ', doc);
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
								db.remove(doc, function(err, res) {
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
								console.log('no results');
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