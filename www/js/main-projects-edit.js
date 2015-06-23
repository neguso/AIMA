angular.module('aima')
	.controller('ProjectEditCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

		$scope.id = 0;

		function load()
		{
			console.log('parent: ' + $stateParams.id);
			$scope.id = $stateParams.id;
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}])
	.controller('ProjectEditInfoCtrl', ['$scope', '$stateParams', '$q', 'projects', function($scope, $stateParams, $q, projects) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready
			loading: { message: 'loading...' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
			
			id: 0,
			project: null,
			start: null, finish: null,
			tasks: new List()
		};


		function load()
		{
			console.log('info: ' + $stateParams.id);
			
			// initialize model
			//$scope.model.id = parseInt($stateParams.id);
			$scope.model.id = db.projects[0].id;

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

			var p2 = projects.tasks($scope.model.id);
			p2
				.then(function(result) {
					$scope.model.tasks.items = result;
				});

			var all = $q.all([p1, p2]);
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
	.controller('ProjectEditTasksCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

		$scope.id = 0;

		function load()
		{
			console.log('tasks: ' + $stateParams.id);
			$scope.id = $stateParams.id;
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}])
	.controller('ProjectEditTeamCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {

		$scope.id = 0;

		function load()
		{
			console.log('team: ' + $stateParams.id);
			$scope.id = $stateParams.id;
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);
