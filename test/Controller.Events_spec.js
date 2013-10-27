describe('cruisemonkey.controllers.Events', function() {
	var orderObjectBy = null;
	
	beforeEach(function() {
		module('cruisemonkey.controllers.Events', function($provide) {
			
		});
		inject(['orderObjectByFilter', function(o) {
			orderObjectBy = o;
		}]);
	});

	describe('orderObjectBy', function() {
		it('should sort 2 numbers ascending', function() {
			expect(orderObjectBy([{foo: 2}, {foo: 1}], 'foo')).toEqual([{foo: 1}, {foo: 2}]);
		});
		it('should sort dates ascending', function() {
			var first = new Date();
			var second = new Date(0);

			expect(orderObjectBy([{start: first}, {start: second}], 'start')).toEqual([{start: second}, {start: first}]);
		});
		it('should sort stringified dates ascending', function() {
			var first = moment(new Date()).format('YYYY-MM-DD HH:mm');
			var second = moment(new Date(0)).format('YYYY-MM-DD HH:mm');

			expect(orderObjectBy([{start: first}, {start: second}], 'start')).toEqual([{start: second}, {start: first}]);
		});
		it('should sort strings ascending', function() {
			expect(orderObjectBy([{foo: 'Banal'}, {foo: 'Anal'}], 'foo')).toEqual([{foo: 'Anal'}, {foo: 'Banal'}]);
		});
		it('should sort complex objects with multiple arguments properly', function() {
			var a = {
				'start':   '2013-04-14 00:00',
				'end':     '2013-04-14 02:00',
				'summary': 'This is a thing.'
			};
			var b = {
				'start':   '2013-04-14 01:00',
				'end':     '2013-04-14 01:30',
				'summary': 'A thing is happening.'
			};
			var c = {
				'start':   '2012-01-01 00:00',
				'end':     '2012-01-01 00:01',
				'summary': 'It is a new year!'
			};
			var d = {
				'start':   '2013-04-14 00:00',
				'end':     '2013-04-14 02:00',
				'summary': 'Not a thing.'
			};

			expect(orderObjectBy([a,b,c,d], ['start', 'end', 'summary'])).toEqual([c,d,a,b]);
			expect(orderObjectBy([a,b,c,d], ['end', 'summary', 'start'])).toEqual([c,b,d,a]);
			expect(orderObjectBy([a,b,c,d], ['summary', 'start', 'end'])).toEqual([b,c,d,a]);
		});
	});

});