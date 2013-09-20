'use strict';

angular.module('cruisemonkey.factories', ['ngResource'])
.factory('EventResource', function($resource) {
	return $resource('/services/events/:type');
})
.factory('EventService', function(EventResource) {
	return {
		get: function(parms) {
			return EventResource.get(parms);
		}
	};
})
.factory('pouchdb', function() {
	Pouch.enableAllDbs = true;
	var db = new Pouch('cruisemonkey');
	Pouch.replicate('cruisemonkey', 'http://sin.local:5984/cruisemonkey', {continuous: true});
	Pouch.replicate('http://sin.local:5984/cruisemonkey', 'cruisemonkey', {continuous: true});
	return db;
})
.factory('pouchWrapper', function($q, $rootScope, pouchdb) {
	return {
		getEvents: function(type) {
			var deferred = $q.defer();
			var map = function(doc) {
				emit(doc.type, doc);
			};
			pouchdb.query({map: map}, {key: type}, function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						console.log('rejected: ', err);
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
			pouchdb.post(doc, function(err, res) {
				$rootScope.$apply(function() {
					if (err) {
						deferred.reject(err)
					} else {
						deferred.resolve(res)
					}
				});
			});
			return deferred.promise;
		},
		remove: function(id) {
			var deferred = $q.defer();
			pouchdb.get(id, function(err, doc) {
				$rootScope.$apply(function() {
					if (err) {
						deferred.reject(err);
					} else {
						pouchdb.remove(doc, function(err, res) {
							$rootScope.$apply(function() {
								if (err) {
									deferred.reject(err)
								} else {
									deferred.resolve(res)
								}
							});
						});
					}
				});
			});
			return deferred.promise;
		}
	}
})
.factory('listener', function($rootScope, pouchdb) {
	pouchdb.changes({
		continuous: true,
		onChange: function(change) {
			if (!change.deleted) {
				$rootScope.$apply(function() {
					pouchdb.get(change.id, function(err, doc) {
						$rootScope.$apply(function() {
							if (err) console.log(err);
							$rootScope.$broadcast('newEvent', doc);
						})
					});
				})
			} else {
				$rootScope.$apply(function() {
					$rootScope.$broadcast('delEvent', change.id);
				});
			}
		}
	})
})
;