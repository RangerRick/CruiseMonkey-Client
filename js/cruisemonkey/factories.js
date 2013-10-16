(function() {
	'use strict';

	angular.module('cruisemonkey.factories', ['ngResource', 'cruisemonkey.Logging', 'cruisemonkey.Database', 'cruisemonkey.User'])
	.factory('pouchWrapper', ['$q', '$rootScope', 'Database', 'LoggingService', 'UserService', function($q, $rootScope, db, log, UserService) {
		return {
			getEvents: function(eventType) {
				var deferred = $q.defer();
				var map = function(doc) {
					if (doc.type === 'event') {
						emit(doc.eventType, doc);
					}
				};
				db.database.query({map: map}, {key: eventType}, function(err, res) {
					$rootScope.$apply(function() {
						if (err) {
							log.error(err);
							deferred.reject(err);
						} else {
							deferred.resolve(res);
						}
					});
				});
				return deferred.promise;
			},
			getFavorites: function() {
				var user = UserService.get();
				var deferred = $q.defer();
				var map = function(doc) {
					if (doc.type === 'favorite') {
						emit(doc.username, doc.favorite);
					}
				};
				db.database.query({map: map}, {key: user.username}, function(err, res) {
					$rootScope.$apply(function() {
						if (err) {
							log.error(err);
							deferred.reject(err);
						} else {
							deferred.resolve(res);
						}
					});
				});
				return deferred.promise;
			},
			add: function(doc) {
				var deferred = $q.defer();
				db.database.post(doc, function(err, res) {
					$rootScope.$apply(function() {
						if (err) {
							deferred.reject(err);
						} else {
							deferred.resolve(res);
						}
					});
				});
				return deferred.promise;
			},
			remove: function(id) {
				var deferred = $q.defer();
				db.database.get(id, function(err, doc) {
					$rootScope.$apply(function() {
						if (err) {
							deferred.reject(err);
						} else {
							db.database.remove(doc, function(err, res) {
								$rootScope.$apply(function() {
									if (err) {
										deferred.reject(err);
									} else {
										deferred.resolve(res);
									}
								});
							});
						}
					});
				});
				return deferred.promise;
			}
		};
	}]);
}());