function PageElement(element, elementId, index) {
	if (!element || !elementId || index === undefined) {
		throw new TypeError("You must pass an element, element ID, and match index!");
	}

	var m_element      = element,
	 	m_elementId    = elementId,
	 	m_index        = index;
	
	this.getElement = function() {
		return m_element;
	};
	this.getId = function() {
		return m_elementId;
	};
	this.getIndex = function() {
		return m_index;
	};
	this.toString = function() {
		return m_elementId + ' (' + m_index + ')';
	};
}

function PageTracker(amplify, elementCriteria) {
	if (!amplify|| !elementCriteria) {
		throw new TypeError("You must pass an Amplify storage class and an element match criteria!");
	}

	var m_amplify         = amplify,
		m_elementCriteria = elementCriteria,
		m_elementCache    = [],
		self = this;

	/** public methods **/
	self.getScrolledId = function(page) {
		console.log('PageTracker::getScrolledId(' + page + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		return f_getPageCache()[page];
	};
	
	self.setScrolledId = function(page, id) {
		console.log('PageTracker::setScrolledId(' + page + ', ' + id + ')');
		if (!page) {
			throw new TypeError("You must specify a page!");
		}
		var page_store_cache = f_getPageCache();
		page_store_cache[page] = id;
		f_setPageCache(page_store_cache);
		return id;
	};

	self._getElement = function(criteria) {
		return $(criteria);
	};
	self.getElement = function(criteria) {
		self._memoize = self._memoize || {};
		return (criteria in self._memoize) ? self._memoize[criteria] : self._memoize[criteria] = self._getElement(criteria);
	};

	self.getTopElement = function(pageId) {
		var matched = f_getElementForPageId(pageId);
		if (matched) {
			return matched;
		}
		return null;
	};

	self.getHeader = function() {
		return self.getElement('#header');
	};
	self.getContainer = function() {
		return self.getElement('#content');
	};

	/** internal methods **/
	var f_getPageCache = function() {
		var page_store_cache = m_amplify.store('page_store_cache');
		if (!page_store_cache) {
			page_store_cache = {};
		}
		return page_store_cache;
	},
	f_setPageCache = function(new_page_store_cache) {
		m_amplify.store('page_store_cache', new_page_store_cache);
	},
	f_getElementForPageId = function(pageId) {
		var topElement = self.getScrolledId(pageId),
			page = self.getElement('#' + pageId),
			matched = null,
			id = null;

		page.find(m_elementCriteria).each(function(index, element) {
			id = $(element).attr('id');
			if (id == topElement) {
				matched = new PageElement(element, id, index);
				console.log('PageTracker::getElementForPageId(' + pageId + '): matched ' + matched.toString());
				return false;
			}
			return true;
		});

		return matched;
	};

}
