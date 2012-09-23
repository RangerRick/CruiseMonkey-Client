function get(name, defaultValue) {
	try {
		val = window.localStorage.getItem(name);
		if (val != undefined && val != 'undefined') {
			return window.JSON.parse(val, function(key, value) {
				if (value == 'undefined') {
					return undefined;
				}
				/*
				if (key == 'start' || key == 'end') {
					try {
						log.debug("before: " + value);
						value = new Date(value);
						log.debug("after: " + value);
					} catch (dateException) {
						log.warn("failed to parse date", dateException);
						value = Date.parse(value);
					}
				}
				*/
				return value;
			});
		}
	} catch (e) {
		log.warn("failed to get " + name, e);
	}
	return defaultValue;
}
	
function save(name, obj) {
	if (obj == undefined) {
		return window.localStorage.removeItem(name);
	}

	var stringify = window.JSON.stringify(obj, function(key, value) {
		/*
		if (key == 'start' || key == 'end') {
			if (!(value instanceof Date)) {
				value = new Date(value);
			}
			value = value.getTime();
		}
		*/
		return value;
	});
	return window.localStorage.setItem(name, stringify);
}

