(function() {
	'use strict';

	angular.module('cruisemonkey.Config', [])
	.value('config.logging.useStringAppender', false)
	.value('config.database.name', 'cruisemonkey')
	.value('config.database.replicateTo', 'http://192.168.211.50:5984/cruisemonkey')
	.value('config.app.version', '3.90');
}());