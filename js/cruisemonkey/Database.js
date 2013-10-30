(function() {
	'use strict';

	angular.module('cruisemonkey.Database', ['cruisemonkey.Logging', 'cruisemonkey.Config', 'ngInterval', 'angularLocalStorage'])
	.factory('Database', ['$location', '$interval', '$timeout', '$rootScope', 'LoggingService', 'storage', 'config.database.host', 'config.database.name', 'config.database.replicate', function($location, $interval, $timeout, $rootScope, log, storage, databaseHost, databaseName, replicate) {
		log.info('Initializing CruiseMonkey database: ' + databaseName);

		var db = new Pouch(databaseName);
		var timeout = null,
			watchingChanges = false;

		db.compact();

		storage.bind($rootScope, '_seq', {
			'defaultValue': 0,
			'storeName': 'cm.db.sync'
		});
		console.log('last sequence: ' + $rootScope._seq);

		var databaseReady = function() {
			if (watchingChanges) {
				return;
			}

			watchingChanges = true;
			
			log.info('Watching for document changes.');
			var seq = $rootScope._seq;
			if (!seq) {
				seq = 0;
			}
			db.changes({
				since: seq,
				onChange: function(change) {
					console.log('change: ', change);
					if (change.seq) {
						$rootScope._seq = change.seq;
					}
					if (change.deleted) {
						$rootScope.$broadcast('cm.documentDeleted', change);
					} else {
						$rootScope.$broadcast('cm.documentUpdated', change.doc);
					}
				},
				continuous: true,
				include_docs: true
			});
			$rootScope.$broadcast('cm.databaseReady');
		};

		var startReplication = function() {
			if (replicate) {
				if (timeout !== null) {
					log.warn('Replication has already been started!  Timeout ID = ' + timeout);
					return false;
				} else {
					var doReplicate = function() {
						log.info('Attempting to replicate with ' + host);
						db.replicate.to(host, {
							'complete': function() {
								db.replicate.from(host, {
									'complete': function() {
										databaseReady();
									}
								});
							}
						});
					};

					if (!databaseHost) {
						databaseHost = $location.host();
					}
					var host = 'http://' + databaseHost + ':5984/cruisemonkey';
					log.info('Enabling replication with ' + host);

					timeout = $interval(function() {
						doReplicate();
					}, 10000);
					doReplicate();

					return true;
				}
			} else {
				log.warn('startReplication() called, but replication is not enabled!');
				registerForChanges();
			}
			return false;
		};

		var stopReplication = function() {
			if (replicate) {
				if (timeout !== null) {
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

		$timeout(function() {
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
		}, 10);

		log.info('Finished initializing CruiseMonkey database.');

		return {
			'database': db,
			'startReplication': startReplication,
			'stopReplication': stopReplication
		};
	}]);
}());
