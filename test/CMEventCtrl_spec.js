describe('UserService', function() {
	beforeEach(module(function($provide) {
		$provide.provider('UserService', LoggedInUserService);
	}));

	it( 'should give me a fake user', inject(function(UserService) {
		expect(UserService.get().username).toEqual('ranger');
	}));
});

