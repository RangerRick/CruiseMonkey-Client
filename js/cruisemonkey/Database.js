(function() {
	'use strict';

	angular.module('cruisemonkey.Database', ['cruisemonkey.Logging', 'cruisemonkey.Config', 'ngInterval'])
	.factory('Database', ['$location', '$interval', 'LoggingService', 'config.database.name', 'config.database.replicate', function($location, $interval, log, databaseName, replicate) {
		log.info('Initializing CruiseMonkey database: ' + databaseName);

		var db = new Pouch(databaseName);
		var timeout = null;
		
		var startReplication = function() {
			if (replicate) {
				if (timeout != null) {
					log.warn('Replication has already been started!  Timeout ID = ' + timeout);
					return false;
				} else {
					var host = 'http://' + $location.host() + ':5984/cruisemonkey';
					log.info('Enabling replication with ' + host);

					timeout = $interval(function() {
						log.info('Attempting to replicate with ' + host);
						db.replicate.to(host, {});
						db.replicate.from(host, {});
					}, 10000);
					return true;
				}
			} else {
				log.warn('startReplication() called, but replication is not enabled!');
			}
			return false;
		};

		var stopReplication = function() {
			if (replicate) {
				if (timeout != null) {
					log.info('Stopping replication with ' + host);
					$interval.cancel(timeout);
					timeout = null;
					return true;
				} else {
					log.info('Replication is already stopped!');
					return false;
				}
			} else {
				log.warn('stopReplication() called, but replication is not enabled!');
			}
		};

		var handleConnectionTypeChange = function() {
			if (navigator.connection.type !== undefined && Connection.WIFI !== undefined) {
				console.log('Connection type is: ' + navigator.connection.type);
				if (navigator.connection.type === Connection.NONE) {
					stopReplication();
				} else {
					startReplication();
				}
			} else if (navigator.connection.bandwidth !== undefined) {
				console.log('Connection bandwidth is: ' + navigator.connection.bandwidth);
				if (navigator.connection.bandwidth > 0) {
					startReplication();
				} else {
					stopReplication();
				}
			}
		};

		if (navigator && navigator.connection) {
			if (navigator.connection.addEventListener) {
				log.info("Browser has native navigator.connection support.");
				navigator.connection.addEventListener('change', handleConnectionTypeChange);
			} else {
				log.info("Browser does not have native navigator.connection support.  Trying with phonegap.");
				document.addEventListener('online', handleConnectionTypeChange);
				document.addEventListener('offline', handleConnectionTypeChange);
			}
		} else {
			log.warn("Unsure how to handle connection management; starting replication and hoping for the best.");
			startReplication();
		}

		log.info('Finished initializing CruiseMonkey database.');

		return {
			'database': db,
			'startReplication': startReplication,
			'stopReplication': stopReplication
		};
	}])
	.factory('listener', ['$rootScope', 'Database', function($rootScope, db) {
		db.database.changes({
			continuous: true,
			onChange: function(change) {
				if (!change.deleted) {
					$rootScope.$apply(function() {
						db.database.get(change.id, function(err, doc) {
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
