angular.module('aima')
	.controller('ActivitiesCtrl', ['$scope', '$state', '$q', 'settings','activities', function($scope, $state, $q, settings, activities) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | content.refresh | content.error
			loading: { message: 'loading...' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

			dateFrom: new Date(), dateTo: new Date(),
			footer: footer,
			take: 20,
			configuration: { sorting: 'ascending', interval: 'week', grouping: 'day' },
			list: new InfiniteList(hasMore, fetchMore),
			refresh: refresh,
			error_more: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry_more) },

			prev: new Command('ion-chevron-left', null, interval_prev),
			next: new Command('ion-chevron-right', null, interval_next),
			create: new Command('ion-plus-round', null, create),
			view: view
		};


		function load()
		{
			// setup model
			$scope.model.configuration.sorting = settings.get('activities.sorting', 'ascending');
			$scope.model.configuration.interval = settings.get('activities.interval', 'week');
			$scope.model.configuration.grouping = settings.get('activities.grouping', 'day');
			switch($scope.model.configuration.interval)
			{
				case 'week':
					$scope.model.dateFrom = moment().startOf('week').startOf('day').toDate();
					$scope.model.dateTo = moment().endOf('week').startOf('day').toDate();
					break;
				case 'month':
					$scope.model.dateFrom = moment().startOf('month').startOf('day').toDate();
					$scope.model.dateTo = moment().endOf('month').startOf('day').toDate();
					break;
			}

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
			var p1 = activities.get(0, $scope.model.take, $scope.model.dateFrom, $scope.model.dateTo);

			p1
				.then(function(result) {
					$scope.model.list.items = format(result.activities, $scope.model.configuration.sorting, $scope.model.configuration.grouping);
					$scope.model.list.retrieved = result.activities.length;
					$scope.model.list.count = result.count;
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
			var p = activities.get($scope.model.list.retrieved, $scope.model.take, $scope.model.dateFrom, $scope.model.dateTo);

			p.then(function(result) {
					Array.prototype.push.apply($scope.model.list.items, format(result.activities, $scope.model.configuration.sorting, $scope.model.configuration.grouping));
					$scope.model.list.retrieved += result.activities.length;
					//todo: what about the case when datasource changes while pagging?
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
			return $scope.model.status !== 'content.error' && $scope.model.list.retrieved < $scope.model.list.count;
		}

		function fetchMore()
		{
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

		function interval_prev()
		{
			switch($scope.model.configuration.interval)
			{
				case 'week':
					$scope.model.dateFrom = moment($scope.model.dateFrom).subtract(1, 'w').toDate();
					$scope.model.dateTo = moment($scope.model.dateTo).subtract(1, 'w').toDate();
					break;
				case 'month':
					$scope.model.dateFrom = moment($scope.model.dateFrom).subtract(1, 'm').toDate();
					$scope.model.dateTo = moment($scope.model.dateTo).subtract(1, 'm').toDate();
					break;
			}
			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function interval_next()
		{
			switch($scope.model.configuration.interval)
			{
				case 'week':
					$scope.model.dateFrom = moment($scope.model.dateFrom).add(1, 'w').toDate();
					$scope.model.dateTo = moment($scope.model.dateTo).add(1, 'w').toDate();
					break;
				case 'month':
					$scope.model.dateFrom = moment($scope.model.dateFrom).add(1, 'M').toDate();
					$scope.model.dateTo = moment($scope.model.dateTo).add(1, 'M').toDate();
					break;
			}
			$scope.model.status = 'loading';
			compose()
				.then(function() {
					$scope.model.status = 'content.ready';
				});
		}

		function create()
		{
			$state.go('main.activities_edit', { id: 0 });
		}

		function view(activity)
		{
			if(activity.header) return;
			$state.go('main.activities_edit', { id: activity.id });
		}


		function footer()
		{
			switch($scope.model.configuration.interval)
			{
				case 'week':
					if($scope.model.dateFrom.getMonth() === $scope.model.dateTo.getMonth())
						return moment($scope.model.dateFrom).format('D') + ' - ' + moment($scope.model.dateTo).format('D MMM YYYY');
					else
						return moment($scope.model.dateFrom).format('D MMM') + ' - ' + moment($scope.model.dateTo).format('D MMM YYYY');
				case 'month': return moment($scope.model.dateFrom).format('MMM YYYY');
			}
			return '?';
		}

		function format(items, sorting, grouping)
		{
			// group
			var ary2 = [], previous = null, group = null;
			if(grouping === 'none')
			{
				// sort by date & project
				var ary1 = items.sort(function(a, b) {
					if(a.day < b.day) return sorting === 'ascending' ? -1 : 1;
					if(a.day > b.day) return sorting === 'ascending' ? 1 : -1;
					if(a.project < b.project) return -1;
					if(a.project > b.project) return 1;
					return 0;
				});

				ary1.forEach(function(item) {
					ary2.push({ id: item.id, weekday: moment(item.day).format('dddd, D MMM'), project: item.project, task: item.task, duration: item.duration, overtime: item.overtime });
				});
			}
			else if(grouping === 'day')
			{
				// sort by date & project
				var ary1 = items.sort(function(a, b) {
					if(a.day < b.day) return sorting === 'ascending' ? -1 : 1;
					if(a.day > b.day) return sorting === 'ascending' ? 1 : -1;
					if(a.project < b.project) return -1;
					if(a.project > b.project) return 1;
					return 0;
				});

				ary1.forEach(function(item) {
					if(previous === null || item.day.valueOf() != previous.valueOf())
						ary2.push(group = { header: true, weekday: moment(item.day).format('dddd, D MMM'), duration: 0, overtime: 0 });
					ary2.push({ id: item.id, header: false, day: item.day, project: item.project, task: item.task, duration: item.duration, overtime: item.overtime });
					group.duration += item.duration;
					group.overtime += item.overtime;
					previous = item.day;
				});
			}
			else if(grouping === 'project')
			{
				// sort projects & date
				var ary1 = items.sort(function(a, b) {
					if(a.project < b.project) return -1;
					if(a.project > b.project) return 1;
					if(a.day < b.day) return sorting === 'ascending' ? -1 : 1;
					if(a.day > b.day) return sorting === 'ascending' ? 1 : -1;
					return 0;
				});

				ary1.forEach(function(item) {
					if(item.project != previous)
						ary2.push(group = { header: true, project: item.project, duration: 0, overtime: 0 });
					ary2.push({ id: item.id, header: false, weekday: moment(item.day).format('dddd, D MMM'), task: item.task, duration: item.duration, overtime: item.overtime });
					group.duration += item.duration;
					group.overtime += item.overtime;
					previous = item.project;
				});
			}
			else
				throw new Error('Invalid arguments.');

			return ary2;
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);
