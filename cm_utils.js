var CMUtils = {
	getSummary: function(element) {
		return $(element).find('div.summary').text();
	},
	isElementInViewport: function(element) {
		var top    = element.offsetTop,
		 	height = element.offsetHeight;

		while (element.offsetParent) {
			element = element.offsetParent;
			top += element.offsetTop;
		}

		return ( top >= window.pageYOffset && (top + height) <= (window.pageYOffset + window.innerHeight) );
	}
};