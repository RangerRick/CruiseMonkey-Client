(function() {
	'use strict';

	angular.module('cruisemonkey.Database', ['cruisemonkey.Logging', 'cruisemonkey.Config'])
	.factory('Database', ['$location', 'LoggingService', 'config.database.name', 'config.database.replicate', function($location, log, databaseName, replicate) {
		log.info('Initializing CruiseMonkey database: ' + databaseName);

		var db = new Pouch(databaseName);

		if (replicate) {
			var options = {
				continuous: true
			};
			var host = 'http://' + $location.host() + ':5984/cruisemonkey';
			log.info('Initializing Replication: ' + host);
			db.replicate.to(host, options);
			db.replicate.from(host, options);
		}

		log.info('Finished initializing CruiseMonkey database.');

		return db;
	}])
	.factory('listener', ['$rootScope', 'Database', function($rootScope, db) {
		db.changes({
			continuous: true,
			onChange: function(change) {
				if (!change.deleted) {
					$rootScope.$apply(function() {
						db.get(change.id, function(err, doc) {
							$rootScope.$apply(function() {
								if (err) log.error(err);
								$rootScope.$broadcast('entryChange', doc);
							});
						});
					});
				} else {
					$rootScope.$apply(function() {
						$rootScope.$broadcast('entryDeleted', change.id);
					});
				}
			}
		});
	}]);
}());
