'use strict';

angular.module('cruisemonkey.controllers', ['cruisemonkey.services'])
/*
	.controller('CMEventCtrl', function($scope, $rootScope, $routeParams, EventResource) {
		$rootScope.eventType = $routeParams.type;
		$rootScope.title = $routeParams.type.capitalize() + ' Events';
		$scope.events = EventResource.query($routeParams);
	})
 */
.controller('CMEventCtrl', function($q, $scope, $rootScope, $routeParams, listener, pouchWrapper) {
	$scope.eventType = $routeParams.type;
	$rootScope.title = $routeParams.type.capitalize() + ' Events';

	$scope.safeApply = function(fn) {
		var phase = this.$root.$$phase;
		if(phase == '$apply' || phase == '$digest') {
			if(fn && (typeof(fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};

	$scope.events = [];
	
	var results = pouchWrapper.getEvents($routeParams.type);
	results.then(function(docs) {
		var events = [];
		docs.rows.forEach(function(doc) {
			events.push(doc.value);
		});
		$scope.events = events;
	});

	$scope.$on('newEvent', function(jsEvent, event) {
		console.log('addEvent: ', event._id);
		$scope.safeApply(function() {
			if (event.type == $scope.eventType) {
				for (var i = 0; i < $scope.events.length; i++) {
					if ($scope.events[i]._id == event._id) {
						$scope.events[i] = event;
						return;
					}
				}
				$scope.events.push(event);
			}
		});
	});
	$scope.$on('delEvent', function(jsEvent, id) {
		console.log('delEvent: ', id);
		$scope.safeApply(function() {
			for (var i = 0; i < $scope.events.length; i++) {
				if ($scope.events[i]._id = id) {
					$scope.events.splice(i,1);
					break;
				}
			}
		});
	});
})
.controller('CMDeckListCtrl', function($scope, $rootScope, $routeParams, $location) {
	$scope.deck = parseInt($routeParams.deck);
	$rootScope.title = "Deck " + $scope.deck;
	$scope.previous = function() {
		if ($scope.deck != 2) {
			$location.path('/deck-plans/' + ($scope.deck - 1));
		}
	};
	$scope.next = function() {
		if ($scope.deck != 15) {
			$location.path('/deck-plans/' + ($scope.deck + 1));
		}
	};
})
;