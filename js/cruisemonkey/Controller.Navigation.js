(function() {
	'use strict';

	angular.module('cruisemonkey.Navigation', ['cruisemonkey.Logging'])
	.controller('CMNavigationCtrl', ['$rootScope', '$scope', '$location', '$document', 'UserService', 'LoggingService', '$mobileFrame', function($rootScope, $scope, $location, $document, UserService, log, $mobileFrame) {
		log.info('Initializing CMNavigationCtrl');
		$scope.toggleDrawer = function() {
			$mobileFrame.toggleNav();
			/*
			var evt = document.createEvent("HTMLEvents");
			evt.initEvent('click', true, true);
			document.getElementById('mobile-nav-toggle').dispatchEvent(evt);
			*/
			return true;
		};
	}]);
}());