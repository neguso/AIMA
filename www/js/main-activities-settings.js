angular.module('aima')
  .controller('ActivitiesSettingsCtrl', ['$scope', '$window', function($scope, $window) {

    $scope.model = {
      sorting: 'ascending', // ascending, descending
      interval: 'week',			// week, month
      grouping: 'day'				// day, project
    };


		function load()
		{
			$scope.model.sorting = JSON.parse($window.localStorage.getItem('activities.sorting'));
			$scope.model.interval = JSON.parse($window.localStorage.getItem('activities.interval'));
			$scope.model.grouping = JSON.parse($window.localStorage.getItem('activities.grouping'));
		}

		function save()
		{
			$window.localStorage.setItem('activities.sorting', JSON.stringify($scope.model.sorting));
			$window.localStorage.setItem('activities.interval', JSON.stringify($scope.model.interval));
			$window.localStorage.setItem('activities.grouping', JSON.stringify($scope.model.grouping));
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});

		$scope.$on('$ionicView.beforeLeave', function() {
			save();
		});
  }]);