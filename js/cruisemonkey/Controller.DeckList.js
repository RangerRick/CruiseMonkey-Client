(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.DeckList', ['ngRoute', 'cruisemonkey.Logging', 'hammer'])
	.controller('CMDeckListCtrl', ['$scope', '$rootScope', '$routeParams', '$location', 'LoggingService', function($scope, $rootScope, $routeParams, $location, LoggingService) {
		LoggingService.info('Initializing CMDeckListCtrl');
		$scope.deck = parseInt($routeParams.deck, 10);
		$rootScope.title = "Deck " + $scope.deck;
		$scope.previous = function() {
			if ($scope.deck !== 2) {
				$location.path('/deck-plans/' + ($scope.deck - 1));
			}
		};
		$scope.next = function() {
			if ($scope.deck !== 15) {
				$location.path('/deck-plans/' + ($scope.deck + 1));
			}
		};
	}]);
}());