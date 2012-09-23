function Favorites() {
	this.contents = get('favorites');
	if (this.contents == undefined || ((typeof this.contents) != 'object') || (!this.contents.length)) {
		this.contents = [];
	}

	this.save = function() {
		save('favorites', this.contents);
		return true;
	};
	this.add = function(id) {
		log.debug("Favorites.add: " + id);
		this.contents.push(id);
		return true;
	};
	this.remove = function(id) {
		log.debug("Favorites.remove: " + id);
		for (var i = 0; i < this.contents.length; i++) {
			if (this.contents[i] == id) {
				this.contents.splice(i, 1);
				break;
			}
		}
		return true;
	};
	this.contains = function(id) {
		for (var i = 0; i < this.contents.length; i++) {
			if (this.contents[i] == id) {
				return true;
			}
		}
		return false;
	};
}