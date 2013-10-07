(function() {
	'use strict';

	angular.module('cruisemonkey.Navigation', ['cruisemonkey.Logging'])
	.controller('CMNavigationCtrl', ['$scope', '$location', 'LoggingService', function($scope, $location, log) {
		log.info('Initializing CMNavigationCtrl');
		$scope.goTo = function(link) {
			log.debug('goTo(' + link + ')');
			$location.path(link);
		};
	}]);
}());