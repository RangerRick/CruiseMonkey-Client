describe('Events', function() {
	var log       = null;
	var service   = null;
	var db        = null;
	
	var dbName    = 'cmtest';

	var async     = new AsyncSpec(this);
	
	async.beforeEach(function(done) {
		console.log('destroying database ' + dbName);
		Pouch.destroy(dbName, function(err) {
			if (err) {
				console.log('failed to destroy database ' + dbName);
			} else {
				console.log('destroyed ' + dbName);
				done();
			}
		});
	});
	
	async.beforeEach(function(done) {
		module('cruisemonkey.Events', function($provide) {
			$provide.value('config.logging.useStringAppender', true);
			$provide.value('config.database.name', dbName);
			$provide.value('config.database.replicateTo', null);
		});

		done();
	});


	async.beforeEach(function(done) {
		inject(['LoggingService', 'EventService', 'Database', function(LoggingService, EventService, Database) {
			log     = LoggingService;
			service = EventService;
			db      = Database;
		}]);

		done();
	});

	async.beforeEach(function(done) {
		// initialize test data
		db.bulkDocs({
			docs: [{
				'_id': '1',
				'type': 'event',
				'username': 'official',
				'summary': 'Murder',
				'description': 'You will be murdered.',
				'isPublic': true
			},
			{
				'_id': '2',
				'type': 'event',
				'username': 'ranger',
				'summary': 'Dying',
				'description': 'I will be dying.',
				'isPublic': true
			},
			{
				'_id': '3',
				'type': 'event',
				'username': 'bob',
				'summary': 'Living',
				'description': 'I am totally going to continue living.',
				'isPublic': true
			},
			{
				'_id': '4',
				'type': 'event',
				'username': 'ranger',
				'summary': 'Private',
				'description': "It's a priiiivate event, dancin' for money, do what you want it to do.",
				'isPublic': false
			},
			{
				'type': 'favorite',
				'username': 'ranger',
				'eventId': '3'
			}
			]
		}, function(err, response) {
			done();
		});
	});

	async.afterEach(function(done) {
		console.log('destroying database ' + dbName);
		Pouch.destroy(dbName, function(err) {
			if (err) {
				console.log('failed to destroy database ' + dbName);
			} else {
				console.log('destroyed ' + dbName);
				done();
			}
		});
	});

	describe("#getAllEvents", function() {
		async.it('should return all events', function(done) {
			expect(db).not.toBeNull();
			expect(service.getAllEvents).not.toBeUndefined();
			service.getAllEvents().then(function(result) {
				console.log(result);
				expect(result['total_rows']).toEqual(4);
				done();
			});
		});
	});

	describe("#getPublicEvents", function() {
		async.it('should return only the events marked isPublic', function(done) {
			expect(db).not.toBeNull();
			expect(service.getPublicEvents).not.toBeUndefined();
			service.getPublicEvents().then(function(result) {
				console.log(result);
				expect(result['total_rows']).toEqual(3);
				done();
			});
		});
	});

	describe("#getUserEvents", function() {
		async.it('should return only the events for user "ranger"', function(done) {
			expect(db).not.toBeNull();
			expect(service.getUserEvents).not.toBeUndefined();
			service.getUserEvents('ranger').then(function(result) {
				console.log(result);
				expect(result.total_rows).toEqual(2);
				expect(result.rows[0].value._id).toBe('2');
				expect(result.rows[1].value._id).toBe('4');
				done();
			});
		});
	});

	describe("#getMyEvents", function() {
		async.it('should return only the events that user "ranger" has created or favorited', function(done) {
			expect(db).not.toBeNull();
			expect(service.getMyEvents).not.toBeUndefined();
			service.getMyEvents('ranger').then(function(result) {
				expect(result.total_rows).toEqual(3);
				expect(result.rows[0].doc._id).toBe('2');
				expect(result.rows[1].doc._id).toBe('4');
				expect(result.rows[2].doc._id).toBe('3');
				done();
			});
		});
	});
});
