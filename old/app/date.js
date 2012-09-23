var days = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
var months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

function formatTime(d, doSeconds) {
	var hour = String('0' + (d.getHours() % 12)).slice(-2);
	if (hour == '00') {
		hour = '12';
	}
	var ret = hour + ':' + String('0' + d.getMinutes()).slice(-2);
	
	if (doSeconds === true) {
		ret += ':' + String('0' + d.getSeconds()).slice(-2);
	}

	if ((d.getHours() % 12) == d.getHours()) {
		ret += 'AM';
	} else {
		ret += 'PM';
	}
	return ret;
}

function formatDate(d) {
	return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate();
}

function getDateFromString(dateTime) {
	if (dateTime instanceof Date) {
		return new Date(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), dateTime.getMinutes(), 0, 0);
	}
	var dateTimeParts = dateTime.split('T');
	var dateParts = dateTimeParts[0].split('-');
	var timeParts = dateTimeParts[1].split(':');
	
	// console.log('year = ' + dateParts[0] + ', month = ' + dateParts[1] + ', day = ' + dateParts[2]);
	// console.log('hours = ' + timeParts[0] + ', minutes = ' + timeParts[1]);
	
	return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], 0, 0);
}

function padNumber(num) {
	return (String('0' + num).slice(-2));
}

function getStringFromDate(d) {
	return d.getFullYear() + '-' + padNumber(d.getMonth() + 1) + '-' + padNumber(d.getDate()) + 'T' + padNumber(d.getHours()) + ':' + padNumber(d.getMinutes()) + ':' + padNumber(d.getSeconds()) + '-00:00';
}