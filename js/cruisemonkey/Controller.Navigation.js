(function() {
	'use strict';

	angular.module('cruisemonkey.Navigation', ['cruisemonkey.Logging'])
	.controller('CMNavigationCtrl', ['$rootScope', '$scope', '$location', '$document', 'UserService', 'LoggingService', function($rootScope, $scope, $location, $document, UserService, log) {
		log.info('Initializing CMNavigationCtrl');
		$scope.toggleDrawer = function() {
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('click', true, true);
			document.getElementById('mobile-nav-toggle').dispatchEvent(evt);
			return true;
		};
	}]);
}());