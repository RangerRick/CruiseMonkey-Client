console.log("app.js loading");

var eventsModel;

/** filter dates in Knockout data-bind **/
ko.bindingHandlers.dateString = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor(),
			allBindings = allBindingsAccessor();
		var valueUnwrapped = ko.utils.unwrapObservable(value);
		var pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
		$(element).text(valueUnwrapped.toString(pattern));
	}
}

/** represents a calendar event **/
function Event(data) {
	var self = this;

	self.id           = ko.observable(data["@id"]);
	self.summary      = ko.observable(data.summary);
	self.description  = ko.observable(data.description);
	self.start        = ko.observable(new Date(data.start));
	self.end          = ko.observable(new Date(data.end));
	self.location     = ko.observable(data.location);
	self.createdBy    = ko.observable(data["created-by"]);
	self.owner        = ko.observable(data.owner);
	self.timespan     = ko.computed(function() {
		var start = start === null? null : formatTime(self.start(), false);
		var end	= end	=== null? null : formatTime(self.end(), false);
		var retVal = "";
		if (start != null) {
			retVal += start;
			if (end != null) {
				retVal += "-" + end;
			}
		}
		return retVal;
	}, self);
}

/** used for filter/searching, match an event based on a filter **/
var matchEventText = function(event, filter) {
	if (event.summary().toLowerCase().search(filter) != -1) {
		return true;
	} else if (event.description().toLowerCase().search(filter) != -1) {
		return true;
	} else {
		return false;
	}
}

/** Wait to make sure no other changes have happened,
  * then perform the mildly expensive check to see what
  * the latest visible element is.
  **/
var onFilterChange = function() {
	/*
	if (scrollTimeout === null) {
		scrollTimeout = setTimeout(function() {
			scrollTimeout = null;
			var found = findTopVisibleElement();
			if (found) {
				console.log("visible element: " + $(found).find('div.summary').text() + ' (' + $(found).attr('id') + ')');
			} else {
				console.log("no elements visible!");
			}
		}, scrollEndDelay);
	}
	*/
};

function EventsViewModel() {
	var self = this;
	self.events = ko.observableArray();

	self.updateData = function(allData) {
		var mappedTasks = $.map(allData.event, function(event) {
			var item = ko.utils.arrayFirst(self.events(), function(entry) {
				if (entry) {
					// console.log("entry = " + ko.toJSON(entry));
					if (entry.id() == event["@id"]) {
						return true;
					} else {
						return false;
					}
				} else {
					console.log("no entry");
				}
			});
			if (item) {
				// console.log("reusing " + ko.toJSON(item));
				var startDate = new Date(event.start);
				var endDate	= new Date(event.end);
				var createdBy = event["created-by"];

				if (item.summary()         != event.summary)       { item.summary(event.summary); }
				if (item.description()     != event.description)   { item.description(event.description); }
				if (item.start().getTime() != startDate.getTime()) { item.start(startDate); }
				if (item.end().getTime()   != endDate.getTime())   { item.end(endDate); }
				if (item.createdBy()       != createdBy)           { item.createdBy(createdBy); }
				if (item.owner()           != event.owner)         { item.owner(event.owner); }
				return item;
			} else {
				return new Event(event);
			}
		});
		self.events(mappedTasks);
		console.log("saving ReST events");
		amplify.store("events", allData);
	}
	
	self.updateDataFromJSON = function() {
		$.getJSON("rest/events", self.updateData);
	};

	self.updateDataFromJSON();
}

eventsModel = new EventsViewModel();

if (typeof(Storage) !== "undefined") {
	var restEvents = amplify.store("events");
	if (restEvents) {
		console.log("loading stored ReST events");
		eventsModel.updateData(restEvents);
	} else {
		console.log("no stored ReST events");
	}
}

function OfficialEventsModel() {
	var self   = this;

	self.filter = ko.observable("");
	self.events = eventsModel.events;
}
var officialEventsModel = new OfficialEventsModel();
officialEventsModel.filter.subscribe(onFilterChange, officialEventsModel);
officialEventsModel.filteredEvents = ko.dependentObservable(function() {
	var self = this;

	var filter = self.filter().toLowerCase();

	var matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
		if (event.owner() != 'admin') {
			return false;
		}
		return true;
	});

	if (!filter) {
		return matchesGroup;
	} else {
		return ko.utils.arrayFilter(matchesGroup, function(event) {
			return matchEventText(event, filter);
		});
	}
}, officialEventsModel);

function MyEventsModel() {
	var self   = this;

	self.filter = ko.observable("");
	self.events = eventsModel.events;
}
var myEventsModel = new MyEventsModel();
myEventsModel.filter.subscribe(onFilterChange, myEventsModel);
myEventsModel.filteredEvents = ko.dependentObservable(function() {
	var self = this;

	var filter = self.filter().toLowerCase();

	var matchesGroup = ko.utils.arrayFilter(self.events(), function(event) {
		if (event.owner() == 'admin') {
			return false;
		}
		return true;
	});

	if (!filter) {
		return matchesGroup;
	} else {
		return ko.utils.arrayFilter(matchesGroup, function(event) {
			return matchEventText(event, filter);
		});
	}
}, myEventsModel);

console.log("app.js loaded");