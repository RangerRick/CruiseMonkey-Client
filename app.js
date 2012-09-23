console.log("app.js loading");

ko.bindingHandlers.dateString = {
	update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
		var value = valueAccessor(),
			allBindings = allBindingsAccessor();
		var valueUnwrapped = ko.utils.unwrapObservable(value);
		var pattern = allBindings.datePattern || 'MM/dd/yyyy hh:mm:ss';
		$(element).text(valueUnwrapped.toString(pattern));
	}
}

function Event(data) {
	var self = this;
	self.id = data.id;
	self.summary = ko.observable(data.summary);
	self.description = ko.observable(data.description);
	self.start = ko.observable(new Date(data.startDate));
	self.end = ko.observable(new Date(data.endDate));
	self.createdBy = ko.observable(data.createdBy);
}

var entryIdMatch = function(entry, id) {
	return entry.id === id;
}

function EventsViewModel() {
	var self = this;
	self.events = ko.observableArray();

	self.updateDataFromJSON = function() {
	    $.getJSON("/events.json", function(allData) {
	        var mappedTasks = $.map(allData.eventList, function(event) {
	        	var item = ko.utils.arrayFirst(self.events(), function(entry) {
	        		if (entry.id == event.id) {
	        			// console.log("found match: " + ko.toJSON(entry));
	        			return true;
	        		} else {
	        			return false;
	        		}
	        	});
	        	if (item) {
//	        		console.log("reusing " + ko.toJSON(item));
	        		var startDate = new Date(event.startDate);
	        		var endDate   = new Date(event.endDate);

	        		if (item.summary()         != event.summary)       { item.summary(event.summary); }
	        		if (item.description()     != event.description)   { item.description(event.description); }
	        		if (item.start().getTime() != startDate.getTime()) { item.start(startDate); }
	        		if (item.end().getTime()   != endDate.getTime())   { item.end(endDate); }
	        		if (item.createdBy         != event.createdBy)     { item.createdBy(event.createdBy); }
	        		return item;
	        	} else {
		        	return new Event(event);
	        	}
	        });
	        self.events(mappedTasks);
	    });    
	};
	
	self.updateDataFromJSON();
}

var eventsModel = new EventsViewModel();

console.log("app.js loaded");