var statusNetOptions = {
//	statusNetRoot: 'https://identi.ca/api',
//	consumerKey: 'ae98c59c12ae2999bcf69a182ec3951f',
//	consumerSecret: 'd541f49bf97cfc7ba3f45cfbb80a9667'
	statusNetRoot: 'http://192.168.211.118/statusnet/api',
	consumerKey: 'a22883fe2cb484a15fb410720090611c',
	consumerSecret: 'b6b73c89064dadaa5312806af43d5efb'
//	callbackUrl: 'http://localhost:8088/'
},
requestParams,
accessParams,
oauth;

var verifyCredentials = function(oauth, successCallback, failureCallback) {
	console.log("verifying credentials");

	oauth.get(statusNetOptions.statusNetRoot + '/oauth/account/verify_credentials.json?skip_status=true',
			// success
			function(data) {
				entry = JSON.parse(data);
				console.log("Success getting credentials. Account = " + entry.screen_name);
				amplify.store.sessionStorage('twitter_entry', entry);
				if (successCallback) {
					successCallback(entry);
				}
			},
			// failure
			function(data) {
				console.log("Failed to get credentials.");
				amplify.store('oauth_data', null);
				amplify.store.sessionStorage('twitter_entry', null);
				if (failureCallback) {
					failureCallback();
				}
			}
		);
}

var doOAuth = function() {
	var url = $.url(document.URL);
	var oauth_token = url.param('oauth_token');
	var oauth_verifier = url.param('oauth_verifier');
	var entry;
	var attemptWindow;

	var storedOauthData = amplify.store('oauth_data');
	if (storedOauthData) {
		statusNetOptions.accessTokenKey = storedOauthData.accessTokenKey;
		statusNetOptions.accessTokenSecret = storedOauthData.accessTokenSecret;
	}
	
	console.log("url = " + document.URL);
	console.log("oauth_token = " + oauth_token);
	console.log("oauth_verifier = " + oauth_verifier);

	if (statusNetOptions.accessTokenKey && statusNetOptions.accessTokenSecret) {
		console.log("We have stored oauth data.  Verifying credentials: " + ko.toJSON(storedOauthData));

		if (!oauth) {
			console.log("creating oauth object");
			oauth = OAuth(statusNetOptions);
		}
		verifyCredentials(oauth);
	} else {
		console.log("No stored oauth data, starting from scratch.");

		if (!oauth) {
			console.log("creating oauth object");
			oauth = OAuth(statusNetOptions);
		}

		oauth.get(statusNetOptions.statusNetRoot + '/oauth/request_token',
			// success
			function(data) {
				console.log("passed oauth");
				console.dir(data);
				if (!data.text || data.text === "") {
					console.log("text is invalid");
					return;
				}
				requestParams = data.text;
				attemptWindow = window.open(statusNetOptions.statusNetRoot + '/oauth/authorize?'+requestParams);

				var waitingForWindow = setInterval(function() {
					var pin = $(attemptWindow.document).find('#oauth_pin').text();
					if (pin && pin.length > 1) {
						console.log("found pin: " + pin);
						clearInterval(waitingForWindow);
						attemptWindow.close();
						
						oauth.get(statusNetOptions.statusNetRoot + '/oauth/access_token?oauth_verifier=' + pin + '&' + requestParams,
							// success
							function(data) {
								accessParams = {};
								var qvars_tmp = data.text.split('&');
								for (var i = 0; i < qvars_tmp.length; i++) {
									var y = qvars_tmp[i].split('=');
									accessParams[y[0]] = decodeURIComponent(y[1]);
								}
								console.log('success: ' + ko.toJSON(data));
								oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);

								var accessData = {};
								accessData.accessTokenKey = accessParams.oauth_token;
								accessData.accessTokenSecret = accessParams.oauth_token_secret;
								amplify.store('oauth_data', accessData);
								
								statusNetOptions.accessTokenKey = accessData.accessTokenKey;
								statusNetOptions.accessTokenSecret = accessData.accessTokenSecret;

								verifyCredentials(oauth);
							},
							// failure
							function(data) {
								console.log("Error: authorization failed: " + ko.toJSON(data));
							}
						);
					}
				}, 200);
			},
			// failure
			function(data) {
				console.log("failed oauth");
				console.dir(data);
			}
		);
	}
}
