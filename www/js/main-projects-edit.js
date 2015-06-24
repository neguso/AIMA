angular.module('aima')
	.factory('edit-project', [function() {
		return { id: 0 };
	}])
	.controller('ProjectEditCtrl', ['$scope', '$state', '$ionicHistory', function($scope, $state, $ionicHistory) {

		$scope.go = function(tab)
		{
			switch(tab)
			{
				case 0:
					$state.go('main.projects_edit.info', null, { location: 'replace' });
					break;
				case 1:
					$state.go('main.projects_edit.tasks', null, { location: 'replace' });
					break;
				case 2:
					$state.go('main.projects_edit.team', null, { location: 'replace' });
					break;
			}
		};

	}])
	.controller('ProjectEditInfoCtrl', ['$scope', '$q', 'projects', 'edit-project', function($scope, $q, projects, current) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready
			loading: { message: 'loading...' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
			
			id: 0,
			project: null,
			start: null, finish: null
		};


		function load()
		{			
			// initialize model
			$scope.model.id = current.id;

			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function retry()
		{
			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function compose()
		{
			var p1 = projects.load($scope.model.id);
			p1
				.then(function(result) {
					$scope.model.project = result;
					$scope.model.start = moment($scope.model.project.start).fromNow();
					$scope.model.finish = moment($scope.model.project.finish).fromNow();
				});

			var all = $q.all([p1]);
			all
				.catch(function(error) {
					compose_error();
				});

			return all;
		}

		function compose_error()
		{
			$scope.model.status = 'error';
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}])
	.controller('ProjectEditTasksCtrl', ['$scope', 'projects', 'edit-project', function($scope, projects, current) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready
			loading: { message: 'loading...' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
			
			id: 0,
			list: new List()
		};

		function load()
		{
			// initialize model
			$scope.model.id = current.id;

			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function retry()
		{
			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function compose()
		{
			var p = projects.tasks($scope.model.id);
			p
				.then(function(result) {
					$scope.model.list.items = result;
				})
				.catch(function(error) {
					compose_error();
				});

			return p;
		}

		function compose_error()
		{
			$scope.model.status = 'error';
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}])
	.controller('ProjectEditTeamCtrl', ['$scope', '$q', 'projects', 'edit-project', function($scope, $q, projects, current) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready
			loading: { message: 'loading...' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
			
			id: 0,
			list: new List()
		};

		function load()
		{
			// initialize model
			$scope.model.id = current.id;

			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function retry()
		{
			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function compose()
		{
			var p1 = projects.load($scope.model.id);
			p1
				.then(function(result) {
					$scope.model.list.items = result.members.map(function(item) { return { id: item.employee.id, name: item.employee.name }; });
				});

			var all = $q.all([p1]);
			all
				.catch(function(error) {
					compose_error();
				});

			return all;
		}

		function compose_error()
		{
			$scope.model.status = 'error';
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);
