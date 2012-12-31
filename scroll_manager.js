function Scroll(enabled, timeout) {
	this.enabled = enabled;
	this.timeout = timeout;
}

function ScrollManager() {
	var m_currentScroll  = null,
		m_enabled        = true,
		self             = this;

	/* User-configurable options */
	self.delay = 500; // ms
	self.onScrollStart = function(enabled) {};
	self.onScrollStop  = function(enabled) {};

	/* Public methods */
	self.disable = function() {
		// console.log("ScrollManager::disable()");
		m_enabled = false;
	};
	self.enable = function() {
		// console.log("ScrollManager::enable()");
		m_enabled = true;
	};

	/* Internal callbacks */
	var f_onScrollStart = function() {
		var enabled = m_enabled;

		if (m_currentScroll === null) {
			console.log('ScrollManager::onScrollStart(): scrolling started (enabled = ' + enabled + ')');
			self.onScrollStart(enabled);
			m_currentScroll = new Scroll(enabled, setTimeout(f_onScrollStop, self.delay));
		} else {
			clearTimeout(m_currentScroll.timeout);
			m_currentScroll.timeout = setTimeout(f_onScrollStop, self.delay);
		}
	},
	f_onScrollStop = function(callback) {
		var enabled = m_currentScroll.enabled;

		console.log('ScrollManager::onScrollStop() (enabled = ' + enabled + ')');
		clearTimeout(m_currentScroll.timeout);
		m_currentScroll.timeout = null;
		m_currentScroll = null;

		self.onScrollStop(enabled);
	};
	
	/* Attach the scrolling callback */
	$(window).scroll(f_onScrollStart);
}
