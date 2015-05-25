angular.module('aima')
	.controller('ActivitiesCtrl', ['$scope', '$q', 'activities', function($scope, $q, activities) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | content.refresh | content.error
			loading: { message: '' },
			error: { message: 'Check your connection and try again.', retry: new Command('Retry', retry) },

			week: new Date(),
			skip: 0, take: 20, count: 0,
			list: new InfiniteList(),
			refresh: refresh,
			error_more: new Command('Retry', retry_more)
		};


		function load()
		{
			// setup model
			$scope.model.week.setDate($scope.model.week.getDate() - $scope.model.week.getDay() + 1);
			$scope.model.skip = 0;
			$scope.model.list.hasMore = hasMore;
			$scope.model.list.fetchMore = fetchMore;

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

		function refresh()
		{
			$scope.model.status = 'content.refresh';
			$scope.model.skip = 0;
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				})
				.finally(function() {
					$scope.$broadcast('scroll.refreshComplete');
				});
		}

		function compose()
		{
			var p1 = activities.get($scope.model.skip, $scope.model.take, $scope.model.week);

			p1
				.then(function(result) {
					$scope.model.list.items = result.activities.map(function(item) {
						return { weekday: moment(item.day).format('dddd'), project: item.project, task: item.task, duration: item.duration, overtime: item.overtime };
					});
					$scope.model.count = result.count;
				})
				.catch(function(error) {
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

		function more()
		{
			var p = activities.get($scope.model.skip + $scope.model.list.items.length, $scope.model.take, $scope.model.week);

			p.then(function(result) {
				var items = result.activities.map(function(item) {
					return { weekday: moment(item.day).format('dddd'), project: item.project, task: item.task, duration: item.duration, overtime: item.overtime };
				});
				Array.prototype.push.apply($scope.model.list.items, items);
			})
			.catch(function(error) {
				more_error();
			});

			return p;
		}

		function more_error()
		{
			$scope.model.status = 'content.error';
		}
		
		function hasMore()
		{
			//if($scope.model.status === 'content.error') return false;
			return ($scope.model.status === 'content.ready') && ($scope.model.skip + $scope.model.take < $scope.model.count);
		}

		function fetchMore()
		{
			if($scope.model.status === 'content.ready')
				$scope.model.status = 'content.refresh';
			more()
				.then(function() {
					$scope.model.status = 'content.ready';
				})
				.finally(function() {
					$scope.$broadcast('scroll.infiniteScrollComplete');
				});
		}

		function retry_more()
		{
			$scope.model.status = 'content.ready';
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);