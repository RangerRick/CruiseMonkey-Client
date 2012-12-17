function PageNavigator(amplify, pageTracker, defaultPage, elementCriteria) {
	if (!amplify || !pageTracker || !defaultPage || !elementCriteria) {
		throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!");
	}

	var m_amplify         = amplify,
	 	m_pageTracker     = pageTracker,
	 	m_defaultPage     = defaultPage,
	 	m_elementCriteria = elementCriteria,
	 	self = this;

	self.getCurrentPage = function() {
	    var current_page = m_amplify.store('current_page');
	    console.log('PageNavigator::getCurrentPage(): current_page = ' + current_page);
	    if (!current_page || current_page == 'login') {
	    	current_page = m_defaultPage;
	    	amplify.store('current_page', current_page);
	    }
	    return current_page;
	};

	self.findTopVisibleElement = function() {
		console.log('PageNavigator::findTopVisibleElement()');

		var found = null,
		 	current_page = self.getCurrentPage(),
			id = null;

		pageTracker.getElement('#' + current_page).find(m_elementCriteria).each(function(index, element) {
			if (CMUtils.isElementInViewport(element)) {
				id = $(element).attr('id');
				if (id) {
					var summary = CMUtils.getSummary(element);
					console.log("PageNavigator::findTopVisibleElement(): first visible element on " + current_page + ": " + summary + ' (' + id + ')');
					m_pageTracker.setScrolledId(current_page, id);
					found = element;
					return false;
				}
			}
			return true;
		});

		return found;
	}


}