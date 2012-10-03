console.log("init.js loading");

var pages = {};
var current_page = 'official-events';
var page_scroll_element = [];

var templates = {
	header: "views/header.html",
	events: "views/events.html",
	loaded: 0,
	requested: 0,
};

function elementInViewport(el) {
	var top = el.offsetTop;
	// var left = el.offsetLeft;
	// var width = el.offsetWidth;
	var height = el.offsetHeight;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		// left += el.offsetLeft;
	}

	return (top >= window.pageYOffset
		// && left >= window.pageXOffset
		&& (top + height) <= (window.pageYOffset + window.innerHeight)
		// && (left + width) <= (window.pageXOffset + window.innerWidth)
	);
}

function _getPageStoreCache() {
	// console.log("store currently contains: " + ko.toJSON(amplify.store()));
	var page_store_cache = amplify.store('page_store_cache');
	if (!page_store_cache) {
		page_store_cache = {};
	}
	return page_store_cache;
}

function _setPageStoreCache(cache) {
	console.log("set cache: " + ko.toJSON(cache));
	amplify.store('page_store_cache', cache);
}

function updatePageTopElement(page, id) {
	console.log("storing " + id + " as the top element for page " + page);
	var page_store_cache = _getPageStoreCache();
	page_store_cache[page] = id;
	_setPageStoreCache(page_store_cache);
	return id;
}

function getPageTopElement(page) {
	var page_store_cache = _getPageStoreCache();
	var retVal = null;
	if (page_store_cache) {
		retVal = page_store_cache[page];
	}
	console.log("getPageTopElement(" + page + ") = " + retVal);
	return retVal;
}

var scrollTimeout = null;
var scrollEndDelay = 500; // ms

function findTopVisibleElement() {
	var found = null;
	$('.calendar-event').each(function(index, element) {
		if (elementInViewport(element)) {
			var id = $(element).attr('id');
			if (id) {
				var summary = $(found).find('div.summary').text();
				console.log("first visible element: " + summary + ' (' + id + ')');
				if (current_page) {
					updatePageTopElement(current_page, id);
				}
			}
			found = element;
			return false;
		}
	});

	return found;
}

function scrollEndHandler() {
	console.log("scrolling finished");
	scrollTimeout = null;
	var found = findTopVisibleElement();
	if (found) {
		console.log("visible element: " + $(found).find('div.summary').text() + ' (' + $(found).attr('id') + ')');
	} else {
		console.log("no elements visible!");
	}
}

$(window).scroll(function() {
	if (scrollTimeout === null) {
		console.log("scrolling started");
	} else {
		clearTimeout(scrollTimeout);
	}
	scrollTimeout = setTimeout( scrollEndHandler, scrollEndDelay );
});

function onDeviceReady( event ) {
	console.log("Device is ready.  Initializing.");
	
	// load Mustache templates
    for (var key in templates) {
        (function() {
            var _key = key.toString();
            if ( _key != "loaded" && _key != "requested" ){
                templates.requested ++;
         
                 var templateLoaded = function( template ){
                    onTemplateLoaded( template, _key );
                 }
                
                $.get( templates[ _key ], templateLoaded );
             }
         })();
    }
}

var _header, _container;

function getHeader() {
	if (!_header) {
		_header = $("body").find("#header");
	}
	return _header;
}

function getContainer() {
	if (!_container) {
		_container = $("body").find("#content");
	}
	return _container;
}

function getScroll() {
	var scroll;
	
	// Netscape compliant
	if (typeof(window.pageYOffset) === 'number') {
		scroll = window.pageYOffset;
	}
	// DOM compliant
	else if (document.body && document.body.scrollTop) {
		scroll = document.body.scrollTop;
	}
	// IE6 standards compliant mode
	else if (document.documentElement && document.documentElement.scrollTop) {
		scroll = document.documentElement.scrollTop;
	}
	// needed for IE6 (when vertical scroll bar is on the top)
	else {
		scroll = 0;
	}
}

function scrollTo(x, y) {
	window.scrollTo(x, y);
}

function setupHeader() {
    header = getHeader();
    header.html(templates.header);
    
    $('nav').find('a').each(function(index, element) {
    	var hash = undefined;
    	if (element.href !== undefined) {
    		hash = element.href.split('#')[1];
    	}
    	if (hash !== undefined && hash != "") {
    		// $(element).off('click');
    		$(element).on('click.fndtn touchstart.fndtn', function(e) {
    			// e.preventDefault();
            	console.log("navigation event: " + hash);
            	navigateTo(hash);
    		});
    	}
    });

    $(document).foundationTopBar();
}

function navigateTo(pageId) {
	if (pageId == 'official-events') {
		showOfficialEventsView();
	} else if (pageId == 'my-events') {
		showMyEventsView();
	} else {
		console.log('unknown page ID: ' + pageId);
		return false;
	}

	var topElement = getPageTopElement(pageId);
	if (topElement) {
		var matched = null;
		$('#content').find('.scrollable').each(function(index, element) {
			var id = $(element).attr('id');
			if (id == topElement) {
				matched = element;
				console.log("matched " + id);
				return false;
			} else {
				console.log("id " + id + " did not match " + topElement);
			}
			return true;
		});

		if (matched) {
			console.log("scrolling to " + topElement);
			matched.scrollIntoView(true);
			window.scrollBy(0, -45);
		} else {
			console.log("didn't find an element to scroll to for " + topElement);
		}
	} else {
		console.log("no top element found for " + pageId);
	}

	return true;
}

function setupDefaultView() {
    console.log("setting up default view");

    var current_page = amplify.store('current_page');
    if (!current_page) {
    	current_page = 'official-events';
    	amplify.store('current_page', current_page);
    }

    setupHeader();
    navigateTo(current_page);

    var interval = setInterval(function() {
    	eventsModel.updateDataFromJSON();
    }, 5000);

    // Hide address bar on mobile devices
    /*
    var Modernizr = window.Modernizr;
    if (Modernizr.touch) {
        $(window).load(function () {
            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 0);
        });
    }
    */

}

function replaceCurrentPage(pageId) {
	getContainer().children().css('display', 'none');
	var page = $('#' + pageId);
	page.css('display', 'block');
    if (!Modernizr.touch) {
    	// on non-mobile devices, focus the search input
    	page.find('input[type=search]')[0].focus();
    }
    amplify.store('current_page', pageId);
	return getContainer()[0];
}

function createOfficialEventsView() {
    if (!pages.official) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'official-events');
    	$(div).css('display', 'none');
    	var html = Mustache.to_html(templates.events, { eventType: "official" });
    	$(div).html(html);
    	pages.official = div;
    	var appended = getContainer()[0].appendChild(div);
        ko.applyBindings(officialEventsModel, appended);
    }
}

function showOfficialEventsView() {
	createOfficialEventsView();
	var content = replaceCurrentPage('official-events');
    $(content).find('ul.event-list').css('display', 'block');
}

function createMyEventsView() {
    if (!pages.my) {
    	var div = document.createElement('div');
    	div.setAttribute('id', 'my-events');
    	$(div).css('display', 'none');
    	var html = Mustache.to_html(templates.events, { eventType: "my" });
    	// console.log("html = " + html);
    	$(div).html(html);
    	pages.my = div;
    	var appended = getContainer()[0].appendChild(div);
        ko.applyBindings(myEventsModel, appended);
    }
}

function showMyEventsView() {
	createMyEventsView();
	var content = replaceCurrentPage('my-events');
    $(content).find('ul.event-list').css('display', 'block');
}

function onTemplateLoaded(template, key) {
	console.log("template '" + key + "' loaded");

//    console.log( key + ": " + template);
    templates[ key ] = template;
    templates.loaded ++;

	if ( templates.loaded == templates.requested ) {
		console.log("all requested templates have been loaded");
		
		createOfficialEventsView();
		createMyEventsView();

        setupDefaultView();
    }
}

console.log("init.js loaded");