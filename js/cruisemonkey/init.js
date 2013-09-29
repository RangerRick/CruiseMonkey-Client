var log;

(function() {
	'use strict';

	log = log4javascript.getLogger();
	var appender = new log4javascript.BrowserConsoleAppender();
	appender.setLayout(new log4javascript.PatternLayout("%d{HH:mm:ss,SSS} [%-5p] %m"));
	log.addAppender(appender);
}());
