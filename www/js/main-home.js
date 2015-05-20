angular.module('aima')
	.controller('HomeCtrl', ['$scope', 'activities', 'projects', function($scope, activities, projects) {

		$scope.model = {
			spinner: true,
			refresh: refresh,
			activities: null,
			projects: null
		};

		 $scope.$on('$ionicView.enter', function() {

			$scope.model.refresh();

    });

		function refresh()
		{
			var p1 = activities.summary();
			var p2 = projects.projects();
			
			p1
				.then(function(result) {
					$scope.model.activities = result.sort(function(a, b) {
						if(a.month < b.month) return -1;
						if(a.month > b.month) return 1;
						return 0;
					}).map(function(item) {
						return { month: moment(item.month).format('MMMM, YYYY'), hours: item.hours, total: item.total };
					});
				})
				.catch(function(error) {
					//todo: display error
				});
			
			p2
				.then(function(result) {
					$scope.model.projects = result.map(function(item) {
						return { name: item.name };
					});
				})
				.catch(function(error) {
					//todo: display error
				});

			$q.all([p1, p2])
				.catch(function(error) {
					//todo: display error
				})
				.finally(function() {
					$scope.model.spinner = false;
					$scope.$broadcast('scroll.refreshComplete');
				});
		}

	}]);