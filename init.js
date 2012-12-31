console.log("init.js loading");

var pages = {},
page_scroll_element = [],
online = false,
m_interval,
_header, _container;

var scrollManager = new ScrollManager();
scrollManager.delay = 100;

/*
scrollManager.onScrollStart = function(enabled) {
	if (enabled) {
		console.log('scrolling started while enabled');
	} else {
		console.log('scrolling started while disabled');
	}
};
*/

scrollManager.onScrollStop = function(enabled) {
	if (enabled) {
		var found = pageNavigator.findTopVisibleElement();
		if (found) {
			console.log("visible element: " + CMUtils.getSummary(found) + ' (' + $(found).attr('id') + ')');
		} else {
			console.log("no elements visible!");
		}
	} else {
		console.log('scrolling stopped while disabled');
	}
};

var templates = ['views/header.html', 'views/events.html', 'views/login.html'],
 	templateLoader  = new TemplateLoader(templates);

templateLoader.onFinished = function() {
	createLoginView();
	createOfficialEventsView();
	createMyEventsView();
    setupDefaultView();
};

var pageTracker = new PageTracker(amplify, '.scrollable'),
pageNavigator   = new PageNavigator(amplify, pageTracker, 'official-events', '.calendar-event'),

setOffline = function() {
	console.log('setOffline()');
	if (online == true) {
		console.log("setOffline: we were online but have gone offline");
	}
	online = false;
	navModel.signedIn(false);
	console.log("online = " + online);
},

setOnline = function() {
	console.log('setOnline()');
	if (online == false) {
		console.log("setOnline: we were offline but have gone online");
	}
	online = true;
	navModel.signedIn(true);
	console.log("online = " + online);
},

isOnline = function() {
	return online;
},

isSignedIn = function() {
	return online && loginModel.username() && loginModel.username().length > 0;
},

setupHeader = function() {
	console.log('setupHeader()');
    header = pageTracker.getHeader();
    header.html(templateLoader.renderTemplate('views/header.html'));
    
    var nav = $(header).find('nav')[0];

    $(nav).find('a').each(function(index, element) {
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
				if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
    		});
    	}
    });

    $(document).foundationTopBar();

    $(nav).find('.signin').each(function(index, element) {
    	$(element).on('click.fndtn touchstart.fndtn', function(e) {
    		setOffline();
    		navigateTo('login');
			if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
    	});
    });
    $(nav).find('.signout').each(function(index, element) {
    	$(element).on('click.fndtn touchstart.fndtn', function(e) {
    		setOffline();
    		serverModel.username(null);
    		serverModel.password(null);
    		navigateTo('login');
			if ($('.top-bar').hasClass('expanded')) $('.toggle-topbar').find('a').click();
    	});
    });

    ko.applyBindings(navModel, nav);
},

navigateTo = function(pageId) {
	console.log('----------------------------------------------------------------------------------');
	console.log('navigateTo(' + pageId + ')');
	scrollManager.disable();

	if (pageId == 'official-events') {
		showOfficialEventsView();
	} else if (pageId == 'my-events') {
		showMyEventsView();
	} else if (pageId == 'login') {
		showLoginView();
	} else {
		console.log('unknown page ID: ' + pageId);
		return false;
	}

	var topElement = pageTracker.getTopElement(pageId);

	if (!topElement || topElement.getIndex() == 0) {
		console.log('scrolling to the top of the page');
		setTimeout(function() {
			pageTracker.getElement('body').scrollTo(0, 0, {
				onAfter: function() {
					setTimeout(function() {
						scrollManager.enable();
					}, 50);
				}
			});
		}, 0);
	} else {
		console.log("scrolling to " + topElement.toString());
		setTimeout(function() {
			pageTracker.getElement('body').scrollTo('#' + topElement.getId(), 0,
				{
					margin:false,
					offset: {left:0, top:-45},
					onAfter: function() {
						setTimeout(function() {
							scrollManager.enable();
						}, 50);
					}
				}
			);
		}, 0);
	}

	return true;
},

checkIfAuthorized = function(success, failure) {
	console.log('checkIfAuthorized()');
	var username = serverModel.username();
	var password = serverModel.password();
	
	if (!username || !password) {
		failure();
		return;
	}

	$.ajax({
		url: serverModel.cruisemonkey() + '/rest/auth',
		dataType: 'json',
		cache: false,
		type: 'GET',
		username: username,
		password: password,
		success: function(data) {
			if (data == true) {
				setOnline();
				console.log('test returned OK');
				success();
				return;
			} else {
				setOnline();
				console.log('success function called, but data was not OK!');
				failure();
				return;
			}
		}
	}).error(function(data) {
		if (data && data.readyState == 0) {
			setOffline();
		} else {
			setOnline();
		}
		console.log("An error occurred: " + ko.toJSON(data));
		failure();
	});
},

showLoginOrCurrent = function() {
	var current_page = pageNavigator.getCurrentPage();

    checkIfAuthorized(
    	// success
    	function() {
    		console.log("checkIfAuthorized: success");
    	    navigateTo(current_page);
    	},
    	// failure
    	function() {
    		console.log("checkIfAuthorized: failure");
    		navigateTo('login');
    	}
    );
},

setupDefaultView = function() {
	
	console.log('setupDefaultView()');
    setupHeader();

    m_interval = setInterval(function() {
    	eventsModel.updateDataFromJSON();
    }, 60000);

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

    showLoginOrCurrent();
},

replaceCurrentPage = function(pageId) {
	console.log('replaceCurrentPage(' + pageId + ')');

	var page = pageTracker.getElement('#' + pageId);
	var search = page.find('input[type=search]').first();

	pageTracker.getContainer().children().css('display', 'none');
	page.css('display', 'block');

    if (!Modernizr.touch) {
    	// on non-mobile devices, focus the search input
    	if (search) {
    		search.focus();
    	}
    }
    if (pageId != 'login') {
        amplify.store('current_page', pageId);
    }
	return pageTracker.getContainer()[0];
},

createOfficialEventsView = function() {
	console.log('createOfficialEventsView()');
	if (!pages.official) {
		var html = templateLoader.renderTemplate('views/events.html', { eventType: "official" });

    	var div = document.createElement('div');
    	div.setAttribute('id', 'official-events');
    	$(div).css('display', 'none');
    	$(div).html(html);
    	var appended = pageTracker.getContainer()[0].appendChild(div);

    	pages.official = div;

        ko.applyBindings(officialEventsModel, appended);
    }
},

showOfficialEventsView = function() {
	console.log('showOfficialEventsView()');
	createOfficialEventsView();
	var content = replaceCurrentPage('official-events');
    $(content).find('ul.event-list').css('display', 'block');
},

createMyEventsView = function() {
	console.log('createMyEventsView()');
	if (!pages.my) {
		var html = templateLoader.renderTemplate('views/events.html', { eventType: "my" });

    	var div = document.createElement('div');
    	div.setAttribute('id', 'my-events');
    	$(div).css('display', 'none');
    	$(div).html(html);
    	var appended = pageTracker.getContainer()[0].appendChild(div);

    	pages.my = div;

        ko.applyBindings(myEventsModel, appended);
    }
},

showMyEventsView = function() {
	console.log('showMyEventsView()');
	createMyEventsView();
	var content = replaceCurrentPage('my-events');
    $(content).find('ul.event-list').css('display', 'block');
},

createLoginView = function() {
	console.log('createLoginView()');
	if (!pages.login) {
		var html = templateLoader.renderTemplate('views/login.html');

    	var div = document.createElement('div');
    	div.setAttribute('id', 'login');
    	$(div).css('display', 'none');
    	$(div).html(html);
		$(div).find('#login_reset').on('click.fndtn touchstart.fndtn', function(e) {
			e.stopPropagation();
			console.log("cancel clicked");
			serverModel.reset();
		});
		$(div).find('#login_save').on('click.fndtn touchstart.fndtn', function(e) {
			e.stopPropagation();
			console.log("save clicked");
			serverModel.persist();
			showLoginOrCurrent();
			if (eventsViewModel) {
				eventsViewModel.updateDataFromJSON();
			}
		});
    	var appended = pageTracker.getContainer()[0].appendChild(div);

		console.log("done creating loginView");
    	pages.login = div;

    	ko.applyBindings(serverModel, appended);
	}
},

showLoginView = function() {
	console.log('showLoginView()');
	createLoginView();
	var content = replaceCurrentPage('login');
};

console.log("init.js loaded");