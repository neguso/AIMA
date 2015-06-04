angular.module('aima')
	.controller('ProjectsCtrl', ['$scope', '$state', '$q', 'settings','projects', function($scope, $state, $q, settings, projects) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | content.refresh
			loading: { message: '' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

			date: null,
			configuration: { filtering: 'all' /* all | active | inactive */, grouping: 'none' /* none | status */, sorting: 'start:ascending' },
			list: new List(),
			refresh: refresh
		};


		function load()
		{
			// setup model
			$scope.model.configuration.sorting = settings.get('projects.sorting', 'ascending');

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

		function refresh()
		{
			if($scope.model.status === 'error')
				$scope.model.list.items.length = 0;

			$scope.model.status = 'content.refresh';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				})
				.finally(function() {
					$scope.$broadcast('scroll.refreshComplete');
				});
			$scope.$digest();
		}

		function compose()
		{
			$scope.model.date = Date.now();
			var p1 = projects.assigned($scope.model.date);

			p1
				.then(function(result) {
					$scope.model.list.items = format(result);
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

		function format(items, filtering, grouping, sorting)
		{
			// filter
			var ary = items.filter(function(item) {
				switch(filtering)
				{
					case 'all': return true;
					case 'active': return ['Not started', 'In progress'].indexOf(item.status) !== -1;
					case 'inactive': return ['On hold', 'Completed', 'Cancelled'].indexOf(item.status) !== -1;
				}
			});
			
			// group
			
			// map
			return ary.map(function(item) {
				return {
					id: item.id,
					name: item.name
				};
			});
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);