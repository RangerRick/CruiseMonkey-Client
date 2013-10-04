(function() {
	'use strict';

	angular.module('cruisemonkey.Database', ['cruisemonkey.Logging', 'cruisemonkey.Config'])
	.factory('db', ['LoggingService', 'config.database.replicateTo', function(log, replicateTo) {
		log.info('Initializing CruiseMonkey database.');

		Pouch.enableAllDbs = true;
		var db = new Pouch('cruisemonkey');

		if (replicateTo) {
			log.info('Initializing Replication: ',replicateTo);
			Pouch.replicate('cruisemonkey', replicateTo, {continuous: true});
			Pouch.replicate(replicateTo, 'cruisemonkey', {continuous: true});
		}

		log.info('Finished initializing CruiseMonkey database.');

		return db;
	}])
	.factory('listener', function($rootScope, db) {
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
	});
}());
