angular.module('aima')
  .controller('ActivitiesSettingsCtrl', ['$scope', 'settings', function($scope, settings) {

    $scope.model = {
      sorting: 'ascending', // ascending | descending
      interval: 'week',			// week | month
      grouping: 'day'				// day | project
    };


		function load()
		{
			$scope.model.sorting = settings.get('activities.sorting', 'ascending');
			$scope.model.interval = settings.get('activities.interval', 'week');
			$scope.model.grouping = settings.get('activities.grouping', 'day');
		}

		function save()
		{
			settings.set('activities.sorting', $scope.model.sorting);
			settings.set('activities.interval', $scope.model.interval);
			settings.set('activities.grouping',  $scope.model.grouping);
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});

		$scope.$on('$ionicView.beforeLeave', function() {
			save();
		});
  }]);