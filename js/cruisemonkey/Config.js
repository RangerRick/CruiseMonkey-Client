(function() {
	'use strict';

	angular.module('cruisemonkey.Config', [])
	.value('config.logging.useStringAppender', false)
	.value('config.database.name', 'cruisemonkey')
	.value('config.database.replicateTo', 'http://172.20.1.112:5984/cruisemonkey')
	.value('config.app.version', '3.90');
}());