'use strict';

angular.module('cruisemonkey.directives', [])
	.directive('lazySrc', function() {
	    return function(scope, element, attrs) {
	        function replaceSrc() {
	        	/*
	            if (element.is(":in-viewport")) {
	                attrs.$set('ngSrc', attrs.lazySrc);
	            }
	            */
	        }

	        $(window).scroll( function() {
	            replaceSrc();
	        });

	        scope.$watch('filteredTemplates', function() {
	            replaceSrc();
	        });
	    };
	})
;