(function() {
	'use strict';

	angular.module('cruisemonkey.Database', ['cruisemonkey.Logging', 'cruisemonkey.Config'])
	.factory('Database', ['LoggingService', 'config.database.name', 'config.database.replicateTo', function(log, databaseName, replicateTo) {
		log.info('Initializing CruiseMonkey database: ' + databaseName);

		// Pouch.enableAllDbs = true;
		var db = new Pouch(databaseName);

		if (replicateTo) {
			log.info('Initializing Replication: ' + replicateTo);
			Pouch.replicate(databaseName, replicateTo, {continuous: true});
			Pouch.replicate(replicateTo, databaseName, {continuous: true});
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
