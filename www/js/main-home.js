angular.module('aima')
	.controller('HomeCtrl', ['$scope', 'activities', function($scope, activities) {

		$scope.model = {
			spinner: true,
			refresh: refresh,
			summary: null
		};

		 $scope.$on('$ionicView.enter', function() {

			$scope.model.refresh();

    });

		function refresh()
		{
			activities.summary()
				.then(function(result) {
					$scope.model.summary = result.sort(function(a, b) {
						if(a.month < b.month) return -1;
						if(a.month > b.month) return 1;
						return 0;
					}).map(function(item) {
						return { month: moment(item.month).format('MMMM, YYYY'), hours: item.hours, total: item.total };
					});
				})
				.catch(function(error) {
					//todo: display error
				})
				.finally(function() {
					$scope.model.spinner = false;
					$scope.$broadcast('scroll.refreshComplete');
				});
		}

	}]);