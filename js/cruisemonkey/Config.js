(function() {
	'use strict';

	angular.module('cruisemonkey.Config', [])
	.value('config.logging.useStringAppender', false)
	.value('config.database.replicateTo', 'http://sin.local:5984/cruisemonkey')
	.value('config.app.version', '3.90');
}());