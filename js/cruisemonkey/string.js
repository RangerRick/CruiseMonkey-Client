(function() {
	'use strict';

	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
	};
	String.prototype.startsWith = function(str) {
		return this.lastIndexOf(str, 0) === 0;
	};
}());
