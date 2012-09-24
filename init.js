console.log("init.js loading");

function setupDefaultView() {
    console.log("setting up default view");

    $("body").find("#content").find('ul.event-list').css('visibility', 'visible');

    $(document).foundationTopBar();

    // initialize model data
    ko.applyBindings(eventsModel);

    var interval = setInterval(function() {
    	eventsModel.updateDataFromJSON();
    }, 30000);

    // Hide address bar on mobile devices
    var Modernizr = window.Modernizr;
    if (Modernizr.touch) {
        $(window).load(function () {
            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 0);
        });
    }
}

function onDeviceReady( event ) {
	console.log("Device is ready.  Initializing.");
	
	setupDefaultView();
}

console.log("init.js loaded");