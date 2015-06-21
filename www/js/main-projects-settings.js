angular.module('aima')
	.controller('ProjectsSettingsCtrl', ['$scope', 'settings', function($scope, settings) {

		$scope.model = {
			filtering: { notstarted: true, inprogress: true, onhold: true, completed: true, cancelled: true },
			grouping: 'none',						// none | status
			sorting: 'start:ascending'	// field: (ascending | descending)
		};


		function load()
		{
			var filtering = settings.get('projects.filtering', '');
			filtering = filtering == '' ? [] : filtering.split(',');
			$scope.model.filtering.notstarted = filtering.length === 0 || filtering.indexOf('Not started') !== -1;
			$scope.model.filtering.inprogress = filtering.length === 0 || filtering.indexOf('In progress') !== -1;
			$scope.model.filtering.onhold = filtering.length === 0 || filtering.indexOf('On hold') !== -1;
			$scope.model.filtering.completed = filtering.length === 0 || filtering.indexOf('Completed') !== -1;
			$scope.model.filtering.cancelled = filtering.length === 0 || filtering.indexOf('Cancelled') !== -1;
			$scope.model.grouping = settings.get('projects.grouping', 'none');
			$scope.model.sorting = settings.get('projects.sorting', 'start:ascending');
		}

		function save()
		{
			var filtering = [];
			if($scope.model.filtering.notstarted) filtering.push('Not started');
			if($scope.model.filtering.inprogress) filtering.push('In progress');
			if($scope.model.filtering.onhold) filtering.push('On hold');
			if($scope.model.filtering.completed) filtering.push('Completed');
			if($scope.model.filtering.cancelled) filtering.push('Cancelled');
			if(filtering.length === 5)
				filtering.length = 0;
			settings.set('projects.filtering', filtering.join(','));
			settings.set('projects.grouping', $scope.model.grouping);
			settings.set('projects.sorting',  $scope.model.sorting);
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});

		$scope.$on('$ionicView.beforeLeave', function() {
			save();
		});
	}]);