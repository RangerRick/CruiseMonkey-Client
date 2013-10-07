(function() {
	'use strict';

	angular.module('cruisemonkey.Events', ['cruisemonkey.Database'])
	.factory('EventService', ['$q', '$rootScope', 'Database', function($q, $rootScope, db) {
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
				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.createdBy, doc);
					} else {
						console.log('Not an event:', doc);
					}
				}, {reduce: false});
			},
			getPublicEvents: function() {
				return doQuery(function(doc) {
					if (doc.type === 'event' && doc.isPublic) {
						emit(doc.createdBy, doc);
					} else {
						console.log('Not an event:', doc);
					}
				}, {reduce: false});
			},
			getUserEvents: function(username) {
				return doQuery(function(doc) {
					if (doc.type === 'event') {
						emit(doc.createdBy, doc);
					} else {
						console.log('Not an event:', doc);
					}
				}, {reduce: false, key: username});
			}
		};
	}]);

}());