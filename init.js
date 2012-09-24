console.log("init.js loading");

var templates = {
	header: "views/header.html",
	events: "views/events.html",
	loaded: 0,
	requested: 0,
};

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

var header, container;

function setupDefaultView() {
    console.log("setting up default view");

    showOfficialEventsView();

    $(document).foundationTopBar();

    // initialize model data
    ko.applyBindings(eventsModel);

    var interval = setInterval(function() {
    	eventsModel.updateDataFromJSON();
    }, 30000);

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

function showOfficialEventsView() {
    header = $("body").find("#header");
    container = $("body").find("#content");

    header.html(templates.header);
    container.html( Mustache.to_html(templates.events, { event_header: "Official Events" }));
    container.find('ul.event-list').css('visibility', 'visible');
}

function onTemplateLoaded(template, key) {
	console.log("template '" + key + "' loaded");

//    console.log( key + ": " + template);
    templates[ key ] = template;
    templates.loaded ++;

	if ( templates.loaded == templates.requested ) {
		console.log("all requested templates have been loaded");
        setupDefaultView();
    }
}

console.log("init.js loaded");