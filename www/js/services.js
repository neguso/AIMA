angular.module('aima.services', [])
	.factory('identity', ['$q', '$timeout', '$window', function($q, $timeout, $window) {

		var identity = {
			token: null,

			// authenticate a user and store the token
			authenticate: function(username, password)
			{
				var defer = $q.defer();

				//todo: call service to get token
				$timeout(function() {
					if(username === 'a' && password === 'a')
					{
						identity.token = { key: 123, expires: new Date(2015, 7, 1) };

						// store token to storage
						$window.localStorage.setItem('identity.token', JSON.stringify(identity.token));

						defer.resolve(identity.token);
					}
					else
					{
						identity.token = null;

						// clear token
						$window.localStorage.removeItem('identity.token');

						defer.reject(identity.token);
					}
				}, 1000);

				return defer.promise;
			},

			// check if current authentication is valid
			check: function()
			{
				var defer = $q.defer();

				// restore token from storage
				if(identity.token === null)
					identity.token = JSON.parse($window.localStorage.getItem('identity.token'));

					//todo: call service to check token
					$timeout(function() {
						if(identity.token === null || identity.token.expires < Date.now())
							defer.reject();
						else
							defer.resolve();
					}, 1000);

				return defer.promise;
			},
			
			// get the authenticated identity information
			identity: function()
			{
				var defer = $q.defer();
				
				
				return defer.promise;
			}
			
		};

		return identity;
	}])
	.factory('activities', ['$q', '$timeout', 'identity', function($q, $timeout, identity) {

		var activities = {
			
			// get monthly activities summary for the current user
			summary: function()
			{
				var defer = $q.defer();
				
				//todo: call service, pass identity.token to autenticate
				$timeout(function() {
					
					defer.resolve([
						{ month: new Date(2015, 2, 1), hours: 168, total: 168 },
						{ month: new Date(2015, 3, 1), hours: 152, total: 160 },
						{ month: new Date(2015, 4, 1), hours: 16, total: 176 }
					]);
				
				}, 1000);
				
				return defer.promise;
			},
			
			get: function() {
				var defer = $q.defer();
			
				//todo: call service, pass identity.token to autenticate
				$timeout(function() {
					
					defer.resolve([]);
				
				}, 1000);
				
				return defer.promise;
			}

		};

		return activities;
	}])
	.factory('projects', ['$q', function($q) {
	
		var projects = {
			asigned: function()
			{

				$timeout(function() {
					defer.resolve([
						{ name: 'accesa Office Administration', status: 'active' },
						{ name: 'Infonic Presales Activities', status: 'active' },
						{ name: 'accesa Improvement', status: 'active' },
						{ name: 'Kruss Proteus', status: 'completed' },
						{ name: 'accesa Evolve', status: 'active' }
					]);
				}, 1000);
				
			}
		};
		
		return projects;
	}]);
