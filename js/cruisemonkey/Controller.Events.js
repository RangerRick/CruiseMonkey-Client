(function() {
	'use strict';

	angular.module('cruisemonkey.controllers.Events', ['ngRoute', 'cruisemonkey.User', 'cruisemonkey.Events', 'cruisemonkey.Logging', 'ui.bootstrap.modal'])
	.filter('orderObjectBy', function() {
		return function(input, attribute) {
			if (!angular.isObject(input)) return input;
			if (!angular.isArray(attribute)) attribute = [attribute];

			var array = [];
			for(var objectKey in input) {
				array.push(input[objectKey]);
			}

			array.sort(function(a,b) {
				for (var i = 0; i < attribute.length; i++) {
					var attr = attribute[i];
					if (attr === 'start' || attr === 'end' || angular.isDate(a[attr]) || angular.isDate(b[attr])) {
						var ad = moment(a[attr]),
							bd = moment(b[attr]);
						if (ad.isBefore(bd)) return -1;
						if (ad.isAfter(bd)) return 1;
					} else if (angular.isNumber(a[attr]) || angular.isNumber(b[attr])) {
						if (a[attr] > b[attr]) return 1;
						if (a[attr] < b[attr]) return -1;
					} else {
						var alc = String(a[attr]).toLowerCase(),
							blc = String(b[attr]).toLowerCase();
						if (alc > blc) return 1;
						if (alc < blc) return -1;
					}
				}
				return 0;
			});

			return array;
		};
	})
	.controller('CMEditEventCtrl', ['$q', '$scope', '$rootScope', '$modal', 'UserService', 'LoggingService', function($q, $scope, $rootScope, $modal, UserService, log) {
		log.info('Initializing CMEditEventCtrl');

		var format="YYYY-MM-DD HH:mm";
		if (Modernizr.inputtypes["datetime-local"]) {
			format="YYYY-MM-DDTHH:mm";
		}

		if ($rootScope.editEvent) {
			$scope.event = angular.copy($rootScope.editEvent);
			delete $rootScope.editEvent;

			$scope.event.start = moment($scope.event.start).format(format);
			$scope.event.end = moment($scope.event.end).format(format);

			log.info('Found existing event to edit.');
			console.log($scope.event);
		} else {
			var start = new Date();
			$scope.event = {
				'start':    moment(start).format(format),
				'end':      moment(new Date(start.getTime() + 60 * 60 * 1000)).format(format),
				'type':     'event',
				'username': UserService.getUsername(),
				'isPublic': true
			};
			log.info('Created fresh event.');
			console.log($scope.event);
		}
	}])
	.controller('CMEventCtrl', ['$scope', '$rootScope', '$timeout', '$routeParams', '$location', '$q', '$modal', '$templateCache', 'UserService', 'EventService', 'LoggingService', 'events', function($scope, $rootScope, $timeout, $routeParams, $location, $q, $modal, $templateCache, UserService, EventService, log, events) {
		log.info('Initializing CMEventCtrl');

		$scope.eventType = $routeParams.eventType;
		$rootScope.title = $routeParams.eventType.capitalize() + ' Events';

		var initializing = true,
			refreshing = false;

		$scope.safeApply = function(fn) {
			var phase = this.$root.$$phase;
			if(phase === '$apply' || phase === '$digest') {
				if(fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		$scope.refresh = function() {
			if (refreshing) { return; }
			refreshing = true;

			$timeout(function() {
				log.info('Refreshing event list.');

				var func;
				if ($routeParams.eventType === 'official') {
					func = EventService.getOfficialEvents;
				} else if ($routeParams.eventType === 'unofficial') {
					func = EventService.getPublicEvents;
				} else if ($routeParams.eventType === 'my') {
					func = EventService.getMyEvents;
				} else {
					log.warn('unknown event type: ' + $routeParams.eventType);
				}

				$q.when(func()).then(function(events) {
					var i, ret = {};
					for (i = 0; i < events.length; i++) {
						var e = events[i];
						if (!e.hasOwnProperty('isFavorite')) {
							e.isFavorite = false;
						}
						ret[e._id] = e;
					}

					refreshing = false;
					initializing = false;

					angular.forEach(ret, function(value, key) {
						$scope.events[key] = value;
					});
					angular.forEach($scope.events, function(value, key) {
						if (!ret[key]) {
							delete $scope.events[key];
						}
					});
				});
			}, 250);
		};

		$scope.fuzzy = function(date) {
			return moment(date).fromNow();
		};
		$scope.justTime = function(date) {
			return moment(date).format('HH:mm');
		};

		$scope.trash = function(ev) {
			$scope.safeApply(function() {
				$q.all([EventService.removeEvent(ev), $scope.events]).then(function(response) {
					var removed = response[0];
					var events  = response[1];
					console.log('removed = ', removed);
					delete events[removed.id];
				});
			});
		};
		
		$scope.edit = function(ev) {
			$scope.safeApply(function() {
				console.log('edit: ', ev);

				ev.start = moment(ev.start).format("YYYY-MM-DD HH:mm");
				ev.end   = moment(ev.end).format("YYYY-MM-DD HH:mm");
				$rootScope.editEvent = ev;

				var modalInstance = $modal.open({
					templateUrl:'edit-event.html',
					controller:'CMEditEventCtrl'
				});
				modalInstance.result.then(function(newEvent) {
					log.info("Save finished!");
					console.log(newEvent);
					$q.all([EventService.updateEvent(newEvent), $scope.events]).then(function(results) {
						var events = results[1];
						events[newEvent._id] = newEvent;
						log.info('Finished updating event.');
					});
				}, function() {
					log.warn("Add canceled!");
				});
			});
		};

		$scope.onFavoriteChanged = function(eventId, checked) {
			if (checked) {
				EventService.addFavorite(eventId);
			} else {
				EventService.removeFavorite(eventId);
			}
		};

		$scope.onPublicChanged = function(event, pub) {
			console.log('onPublicChanged: ', event, pub);
			event.isPublic = pub;
			$q.when($scope.events).then(function(events) {
				events[event._id].isPublic = pub;
				EventService.updateEvent(events[event._id]);
			});
		};

		$scope.$on('cm.eventCacheUpdated', function() {
			if (!initializing) {
				// $scope.refresh();
			}
		});

		$rootScope.actions = [];
		if (UserService.getUsername() && UserService.getUsername() !== '') {
			$rootScope.actions.push({
				'name': 'Add Event',
				'iconClass': 'add',
				'launch': function() {
					log.info('launching modal');
					var modalInstance = $modal.open({
						templateUrl:'edit-event.html',
						controller:'CMEditEventCtrl'
					});
					modalInstance.result.then(function(result) {
						log.info("Save finished!");
						console.log(result);
						$q.all([EventService.addEvent(result), $scope.events]).then(function(results) {
							var added = results[0];
							var events = results[1];
							events[added._id] = added;
						});
					}, function() {
						log.warn("Add canceled!");
					});
				}
			});
		}

		/* console.log('events = ', events); */
		$scope.events = events;
	}]);
}());