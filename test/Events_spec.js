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
				'createdBy': 'official',
				'summary': 'Murder',
				'description': 'You will be murdered.',
				'isPublic': true
			},
			{
				'_id': '2',
				'type': 'event',
				'createdBy': 'ranger',
				'summary': 'Dying',
				'description': 'I will be dying.',
				'isPublic': true
			},
			{
				'_id': '3',
				'type': 'event',
				'createdBy': 'bob',
				'summary': 'Living',
				'description': 'I am totally going to continue living.',
				'isPublic': true
			},
			{
				'_id': '4',
				'type': 'event',
				'createdBy': 'ranger',
				'summary': 'Private',
				'description': "It's a priiiivate event, dancin' for money, do what you want it to do.",
				'isPublic': false
			}]
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
			expect(service.getAllEvents()).not.toBeUndefined();
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
			expect(service.getPublicEvents()).not.toBeUndefined();
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
			expect(service.getUserEvents('ranger')).not.toBeUndefined();
			service.getUserEvents('ranger').then(function(result) {
				console.log(result);
				expect(result.total_rows).toEqual(2);
				expect(result.rows[0].value._id).toEqual('2');
				expect(result.rows[1].value._id).toEqual('4');
				done();
			});
		});
	});
});
