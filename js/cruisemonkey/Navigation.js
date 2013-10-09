(function() {
	'use strict';

	angular.module('cruisemonkey.Navigation', ['cruisemonkey.Logging'])
	.controller('CMNavigationCtrl', ['$scope', '$location', '$document', 'LoggingService', function($scope, $location, $document, log) {
		log.info('Initializing CMNavigationCtrl');
		$scope.toggleDrawer = function() {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('click', true, true);
			document.getElementById('mobile-nav-toggle').dispatchEvent(evt);
		};
		$scope.goTo = function(link) {
			log.debug('goTo(' + link + ')');
			$location.path(link);
		};
	}]);
}());