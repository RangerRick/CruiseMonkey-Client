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
						deferred.resolve(res);
					}
				});
			});
			return deferred.promise;
		}
		
		return {
			getAllEvents: function() {
				log.info('getAllEvents()');
				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.username, doc);
					}
				}, {reduce: false});
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
				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.username, doc);
					}
				}, {reduce: false, key: username});
			},
			getMyEvents: function(username) {
				log.info('getMyEvents(' + username + ')');

				var deferred = $q.defer();
				db.query(
				{
					map: function(doc) {
						if (doc.type === 'event') {
							emit(doc.username, {'_id': doc._id});
						} else if (doc.type === 'favorite') {
							emit(doc.username, {'_id': doc.eventId});
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
							deferred.resolve(res);
						}
					});
				});
				return deferred.promise;
			}
		};
	}]);

}());