angular.module('aima')
	.controller('TestCtrl', ['$scope', function($scope) {

		$scope.model = {
			dateValue: new Date(2015, 1, 23),
			dateDisplay: new Date(2015, 0, 1),
			showWeeks: false,

			durationValue: 10
		};

		$scope.today = function() {
			$scope.model.dateValue = new Date();
		};
		
		$scope.weeks = function() {
			$scope.model.showWeeks = !$scope.model.showWeeks;
		};
		
	}])
	.directive('aimaDuration', function() {

		var layouts = ['horizontal', 'vertical'];

		function link(scope, element, attributes)
		{
			if(typeof scope.min !== 'number')
				scope.min = 0;
			if(typeof scope.max !== 'number')
				scope.max = 100;
			if(scope.min > scope.max)
				scope.max = scope.min + 100;
			if(typeof scope.value !== 'number' || scope.value < scope.min || scope.value > scope.max)
				scope.value = scope.min;
			if(typeof scope.step !== 'number' || scope.step <= 0)
				scope.step = 1;
			if(typeof scope.layout === 'undefined' || layouts.indexOf(scope.layout) === -1)
				scope.layout = 'horizontal';
			if(typeof scope.format === 'undefined' || scope.format.indexOf('{0}') === -1)
				scope.format = '{0}';

			scope.increment = function()
			{
				scope.value += scope.step;
				if(scope.value > scope.max)
					scope.value = scope.max;
			};

			scope.decrement = function()
			{
				scope.value -= scope.step;
				if(scope.value < scope.min)
					scope.value = scope.min;
			};
			
			scope.replace = function(format)
			{
				var args = Array.prototype.slice.call(arguments, 1);
				return format.replace(/{(\d+)}/g, function(match, number) { 
					return typeof args[number] != 'undefined' ? args[number] : match;
				});
			};
		}

		return {
			restrict: 'E',
			scope: {
				value: '=?',
				step: '=?',
				min: '=?',
				max: '=?',
				layout: '@?',
				format: '@?'
			},
			templateUrl: 'views/aima-duration.html',
			link: link
		};
	})
	.directive('aimaCalendar', function() {

		function names(date)
		{
			var day = moment(date).startOf('week');
			var ary = [];
			for(var i = 0; i < 7; i++)
			{
				ary.push(day.format('dd'));
				day.add(1, 'd');
			}
			return ary;
		}
	
		function weeks(display, value)
		{
			var day = moment(display).startOf('month').startOf('week');
			if(day.date() === 1)
				day.add(-1, 'week');
			var ary = [];
			for(var w = 0; w < 6; w++)
			{
				var week = [];
				week.number = day.week();
				for(var d = 0; d < 7; d++)
				{
					week.push({
						text: day.format('D'),
						date: day.toDate(),
						current: (day.month() === display.getMonth()),
						selected: (day.year() === value.getFullYear() && day.month() === value.getMonth() && day.date() === value.getDate())
					});
					day = day.clone().add(1, 'd');
				}
				ary.push(week);
			}
			return ary;
		}
	
		function update(scope)
		{
			scope.header = moment(scope.display).format('MMMM, YYYY');
			scope.names = names(scope.display);
			scope.weeks = weeks(scope.display, scope.value);
		}


		function link(scope, element, attributes)
		{
			if(typeof scope.value === 'undefined' || scope.value === null)
				scope.value = moment().startOf('day').toDate();
			if(typeof scope.display === 'undefined' || scope.display === null)
				scope.display = scope.value;
			if(typeof scope.showWeeks !== 'boolean')
				scope.showWeeks = false;


			scope.navigate = function(delta)
			{
				scope.display = moment(scope.display).add(delta, 'month').toDate();
			};

			scope.select = function(date)
			{
				scope.value = scope.display = date;
			};


			scope.$watch('value', function(newValue, oldValue)
			{
				update(scope);
			});

			scope.$watch('display', function(newValue, oldValue)
			{
				update(scope);
			});

			update(scope);
		}

		return {
			restrict: 'E',
			scope: {
				value: '=?',
				display: '=?',
				showWeeks: "=?"
			},
			templateUrl: 'views/aima-calendar.html',
			link: link
		};
	});