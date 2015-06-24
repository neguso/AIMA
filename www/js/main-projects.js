angular.module('aima')
	.controller('ProjectsCtrl', ['$scope', '$state', '$q', 'settings','projects', 'edit-project', function($scope, $state, $q, settings, projects, edit_project) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | content.refresh
			loading: { message: 'loading...' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

			date: null,
			configuration: { filtering: '' /* 'Not started,In progress,On hold,Completed,Cancelled' */, grouping: 'none' /* none | status */, sorting: 'start:ascending' },
			list: new List(),
			refresh: refresh,
			
			view: view
		};


		function load()
		{
			// setup model
			$scope.model.configuration.filtering = settings.get('projects.filtering', '');
			$scope.model.configuration.grouping = settings.get('projects.grouping', 'none');
			$scope.model.configuration.sorting = settings.get('projects.sorting', 'start:ascending');

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
					$scope.model.list.items = format(result, $scope.model.configuration.filtering, $scope.model.configuration.grouping, $scope.model.configuration.sorting);
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

		function view(project)
		{
			if(project.header) return;
			edit_project.id = project.id;
			$state.go('main.projects_edit.info');
		}


		function format(items, filtering, grouping, sorting)
		{
			// filter
			var ary = filtering == '' ? items : items.filter(function(item) {
				return filtering.indexOf(item.status) !== -1;
			});

			// group
			var ary2 = [];
			var field = sorting.split(':')[0];
			var order = sorting.split(':')[1];
			var states = { 'Not started': 0, 'In progress': 1, 'On hold': 2, 'Completed': 3, 'Cancelled': 4 };
			switch(grouping)
			{
				case 'none':
					// sort by field
					ary2 = ary.sort(function(a, b) {
						if(a[field] < b[field]) return order === 'ascending' ? -1 : 1;
						if(a[field] > b[field]) return order === 'ascending' ? 1 : -1;
						return 0;
					});
					break;

				case 'status':
					// sort by status & field
					ary = ary.sort(function(a, b) {
						if(states[a.status] < states[b.status]) return -1;
						if(states[a.status] > states[b.status]) return 1;
						if(a[field] < b[field]) return order === 'ascending' ? -1 : 1;
						if(a[field] > b[field]) return order === 'ascending' ? 1 : -1;
						return 0;
					});

					// add group headers
					var previous = null, group = null;
					ary.forEach(function(item) {
						if(item.status !== previous)
							ary2.push(group = { count: 0, header: true, status: item.status });
						ary2.push(item);
						group.count++;
						previous = item.status;
					});
					break;
			}

			// map
			return ary2.map(function(item) {
				if(item.hasOwnProperty('header'))
					return item;
				else
					return {
						id: item.id,
						name: item.name,
						status: item.status,
						customer: item.customer
					};
			});
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);