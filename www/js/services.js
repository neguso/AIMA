angular.module('aima.services', [])
  .factory('settings', ['$window', function($window) {

    var settings = {
			set: function(key, value) {
				$window.localStorage.setItem(key, JSON.stringify(value));
			},

			get: function(key) {
				var val = JSON.parse($window.localStorage.getItem(key));
				if(val === null && arguments.length === 2)
					return arguments[1];
				return val;
			}
    };

    return settings;
  }])
  .factory('identity', ['$q', '$timeout', '$window', function($q, $timeout, $window) {

    var identity = {
      token: null,

      // authenticate a user and store the token
      authenticate: function(username, password)
      {
        var defer = $q.defer();

        //todo: call service to get token
        $timeout(function() {

          if(Math.random() > 0.5)
          {
            // simulate connection error
            defer.reject();
          }
          else
          {
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

              defer.resolve(identity.token);
            }
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
          identity.token = JSON.parse($window.localStorage.getItem('identity.tokenX'));

          //todo: call service to check token
          $timeout(function() {
            if(Math.random() > 0.5)
            {
              // simulate connection error
              defer.reject();
            }
            else
            {
              if(identity.token === null || identity.token.expires < Date.now())
                defer.resolve(false);
              else
                defer.resolve(true);
            }
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

          if(Math.random() > 0.5)
          {
            // simulate connection error
            defer.reject();
          }
          else
          {
            defer.resolve([
              { month: new Date(2015, 2, 1), hours: Math.floor(Math.random() * 100), total: 168 },
              { month: new Date(2015, 3, 1), hours: Math.floor(Math.random() * 100), total: 160 },
              { month: new Date(2015, 4, 1), hours: Math.floor(Math.random() * 100), total: 176 }
            ]);
          }
        }, 1000);

        return defer.promise;
      },

      get: function(skip, take, from, to)
      {
        var defer = $q.defer();

        //todo: call service, pass identity.token to autenticate
        $timeout(function() {

          if(Math.random() > 5)
          {
            // simulate connection error
            defer.reject();
          }
          else
          {
            var items = [];
            for(var i = skip; i < Math.min(200, skip + take); i++)
              items.push({
                day: moment(from).add(i % moment(from).diff(to, 'd'), 'd').toDate(),
                project: 'the looong project ' + Math.floor(Math.random() * 5),
                task: 'the name of the task ' + Math.floor(Math.random() * 10),
                duration: 1 + Math.floor(Math.random() * 4),
                overtime: 1 + Math.floor(Math.random() * 4)
              });

            defer.resolve({ activities: items, count: 200 });
          }

        }, 1000);

        return defer.promise;
      },

			load: function(id)
			{
				var defer = $q.defer();
				
				//todo: call service, pass identity.token to autenticate
        $timeout(function() {

          if(Math.random() > 0.5)
          {
            // simulate connection error
            defer.reject();
          }
          else
          {
            defer.resolve({
							id: id,
							date: new Date()
							//todo: add fields
						});
          }

        }, 1000);

        return defer.promise;
			},
			
			update: function()
			{
				var defer = $q.defer();
				
				//todo: call service, pass identity.token to autenticate
        $timeout(function() {

          if(Math.random() > 0.5)
          {
            // simulate connection error
            defer.reject();
          }
          else
          {
            defer.resolve({
							//todo: add fields
						});
          }

        }, 1000);

        return defer.promise;
			}
    };

    return activities;
  }])
  .factory('projects', ['$q', '$timeout', function($q, $timeout) {

    var projects = {
      asigned: function()
      {
        var defer = $q.defer();

        //todo: call service, pass identity.token to autenticate
        $timeout(function() {

          defer.resolve([
            { name: 'accesa Office Administration', status: 'active' },
            { name: 'Infonic Presales Activities', status: 'active' },
            { name: 'accesa Improvement', status: 'active' },
            { name: 'Kruss Proteus', status: 'completed' },
            { name: 'accesa Evolve', status: 'active' }
          ]);

        }, 1000);

        return defer.promise;
      }
    };

    return projects;
  }]);
