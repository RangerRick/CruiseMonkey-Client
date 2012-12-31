if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(elt /*, from*/) {
		var len = this.length >>> 0,
			from = Number(arguments[1]) || 0;

		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0) from += len;

		for (; from < len; from++) {
			if (from in this && this[from] === elt) return from;
		}
		return -1;
	};
}

function TemplateLoader(urls) {
	var self = this,
	m_templateUrls = urls || [],
	m_failed = {},
	m_templates = {},

	f_getSize = function(obj) {
		// http://stackoverflow.com/a/6700/11236
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	},

	f_checkOnFinished = function() {
		var templateLength = f_getSize(m_templates),
			failedLength = f_getSize(m_failed);

		if ((templateLength + failedLength) >= m_templateUrls.length) {
			self.onFinished();
		}
	}
	f_onLoad = function(url, template) {
		console.log('TemplateLoader::f_onLoad(' + url + ', <template>)');
		m_templates[url] = template;

		self.onLoad(url, template);
		f_checkOnFinished();
	},
	f_onFail = function(url, textStatus, errorThrown) {
		console.log('TemplateLoader::f_onFail(' + url + ', ' + textStatus + ')');
		m_failed[url] = errorThrown;

		self.onFail(url);
		f_checkOnFinished();
	},
	f_loadTemplate = function(url) {
		console.log('TemplateLoader::f_loadTemplate(' + url + ')');
		(function() {
			var templateLoaded = function( template ){
				f_onLoad( url, template );
			},
			failed = function(jqXHR, textStatus, errorThrown) {
				f_onFail(url, textStatus, errorThrown);
			};
			$.ajax({
				url: url,
				success: templateLoaded,
				error: failed,
				dataType: 'text'
			});
		})();
	};
	
	self.add = function(url) {
		m_templateUrls.push(url);
	};
	self.remove = function(url) {
		m_templateUrls.splice(m_templateUrls.indexOf(url), 1);
		delete m_templates[url];
		delete m_failed[url];
	};
	self.clear = function() {
		m_templateUrls = [];
		m_templates = {};
		m_failed = {};
	};
	self.urls = function() {
		return m_templateUrls.slice(0);
	};
	self.getTemplate = function(url) {
		return m_templates[url];
	};
	self.renderTemplate = function(url, replacements) {
		if (!replacements) {
			replacements = {};
		}
		var template = m_templates[url];
    	return Mustache.to_html(template, replacements);
	};

	self.load = function() {
		console.log("TemplateLoader::load()");
		var index, url;
		for (index in m_templateUrls) {
			url = m_templateUrls[index];
			console.log('TemplateLoader::load(): loading ' + url);
			f_loadTemplate(url);
		}
	}
	self.onLoad = function(url) {
	};
	self.onFail = function(url) {
	};
	self.onFinished = function() {
	};
}