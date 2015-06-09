angular.module('aima.services', [])
  .factory('settings', ['$window', function($window) {

    var settings = {
			set: function(key, value) {
				if(value === null)
					$window.localStorage.removeItem(key);
				else
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
  .factory('identity', ['$q', '$timeout', '$window', 'settings', function($q, $timeout, $window, settings) {

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

			logout: function()
			{
				settings.set('identity.token', null);
				identity.token = null;
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
      summary: function(months)
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
						var result = [], hours;
						for(var m = 0; m < months.length; m++)
						{
							hours = 0;
							for(var a = 0; a < db.activities.length; a++)
							{
								var activity = db.activities[a];
								if(activity.date.getFullYear() === months[m].getFullYear() && activity.date.getMonth() === months[m].getMonth())
									hours += activity.duration + activity.overtime;
							}

							result.push({
								month: months[m],
								hours: hours,
								total: 160
							});
						}

            defer.resolve(result);
          }
        }, 1000);

        return defer.promise;
      },

      get: function(skip, take, from, to)
      {
        var defer = $q.defer();

        //todo: call real service, pass identity.token to autenticate
        $timeout(function() {

          if(Math.random() > 5)
          {
            // simulate connection error
            defer.reject();
          }
          else
          {
						to = moment(to).add(1, 'd').toDate();
						
						var result = { activities: [], count: 0 };
						for(var a = 0; a < db.activities.length; a++)
						{
							var activity = db.activities[a];

							if(activity.date >= from && activity.date < to)
							{
								result.count++;

								if(skip-- <= 0 && result.activities.length < take)
									result.activities.push({
										day: activity.date,
										project: activity.project.name,
										task: activity.task.name,
										duration: activity.duration,
										overtime: activity.overtime
									});
							}
						}

						defer.resolve(result);
          }

        }, 1000);

        return defer.promise;
      },

			create: function()
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
							id: 0,
							date: moment(new Date()).startOf('day').toDate(),
							project: null,
							task: null,
							duration: 0,
							overtime: 0,
							notes: ''
						});
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
						var activity = null;
						for(var a = 0; a < db.activities.length; a++)
						{
							activity = db.activities[a];
							if(activity.id === id)
								break;
						}
						if(activity === null)
							defer.resolve(activity);
						else
							defer.resolve(null);
          }

        }, 1000);

        return defer.promise;
			},

			update: function(activity)
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
						if(activity.id === 0)
						{
							activity.id = ++k;
							db.activities.push(activity);
							defer.resolve({ status: 'added', activity: activity });
						}
						else
						{
							var record = null;
							for(var a = 0; a < db.activities.length; a++)
							{
								record = db.activities[a];
								if(record.id === id)
									break;
							}
							if(activity === null)
							{
								defer.resolve({ status: 'not-found' });
							}
							else
							{
								record.date = activity.date;
								record.project = activity.project;
								record.task = activity.task;
								record.duration = activity.duration;
								record.overtime = activity.overtime;
								record.notes = activity.notes;

								defer.resolve({ status: 'updated', activity: record });
							}
						}

          }

        }, 1000);

        return defer.promise;
			}
    };

    return activities;
  }])
  .factory('projects', ['$q', '$timeout', function($q, $timeout) {

    var projects = {
			
      assigned: function(date)
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
						defer.resolve(db.projects.map(function(item) {
							return {
								id: item.id,
								name: item.name,
								status: db.project_status[item.status],
								start: item.start,
								finish: item.finish,
								customer: item.customer.name
							};
						}));
					}

        }, 1000);

        return defer.promise;
      }
    };

    return projects;
  }]);









var k = 0;
var db = {
	customers: [],
	project_status: ['Not started', 'In progress', 'On hold', 'Completed', 'Cancelled'],
	projects: [],
	activities: []	
};

// create customers
for(var c = 0; c < 50; c++)
{
	var customer = {
		id: ++k,
		name: 'Happy Enterprise Father & Son Ltd. ' + c.toString()
	};

	db.customers.push(customer);
}


// create projects
for(var p = 0; p < 100; p++)
{
	var start = new Date(2014, 0, 1 + Math.floor(Math.random() * 365 * 2));
	var customer = db.customers[Math.floor(Math.random() * db.customers.length)];
	var project = {
		id: ++k,
		name: 'A very interesting project ' + p.toString(),
		status: Math.floor(Math.random() * 5),
		start: start, finish: new Date(start.getFullYear(), start.getMonth() + 1 + Math.floor(Math.random() * 12), start.getDate()),
		tasks: [],
		customer: { id: customer.id, name: customer.name }
	};
	
	// create tasks
	var tc = 2 + Math.floor(9 * Math.random());
	for(var t = 0; t < tc; t++)
	{
		var task = {
			id: ++k,
			name: 'Exciting task ' + t.toString()
		};
		project.tasks.push(task);
	}
	
	db.projects.push(project);
}

// create activities
var date = new Date(2015, 0, 1);
for(var d = 0; d < 365; d++)
{
	var ac = 1 + Math.floor(Math.random() * 3);
	for(var a = 0; a < ac; a++)
	{
		var project = db.projects[Math.floor(Math.random() * db.projects.length)];
		var task = project.tasks[Math.floor(Math.random() * project.tasks.length)];
		db.activities.push({
			id: ++k,
			date: new Date(date.getFullYear(), 0, d),
			project: { id: project.id, name: project.name },
			task: { id: task.id, name: task.name },
			duration: Math.floor(2 + Math.random() * 4),
			overtime: Math.floor(Math.random() * 2),
			notes: 'A few notes about the activity with id ' + k.toString()
		});
	}
}


