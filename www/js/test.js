angular.module('aima')
	.controller('TestCtrl', ['$scope', function($scope) {

		$scope.dateValue = new Date(2015, 1, 23);
		$scope.dateDisplay = new Date(2015, 0, 10);

		$scope.date = function()
		{
			return moment($scope.dateValue).format('dddd, D MMMM, YYYY');
		};
		
		$scope.today = function() {
			$scope.dateValue = new Date();
		};
		
	}])
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
				day = day.clone().add(-1, 'week');
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

		return {
			restrict: 'E',
			scope: {
				value: '=?',
				display: '=?',
				showWeeks: "=?"
			},
			templateUrl: 'views/aima-calendar.html',
			link: function(scope, element, attributes) {

				if(typeof scope.value === 'undefined' || scope.value === null)
					scope.value = moment().startOf('day').toDate();
				if(typeof scope.display === 'undefined' || scope.display === null)
					scope.display = scope.value;
				if(typeof scope.showWeeks !== 'boolean')
					scope.showWeeks = false;

				
				scope.$watch('value', function(newValue, oldValue)
				{
					alert(newValue);
				});
				
				update(scope);

				scope.navigate = function(delta)
				{
					scope.display = moment(scope.display).add(delta, 'month').toDate();
					update(scope);
				};
				
				scope.select = function(date)
				{
					scope.value = scope.display = date;
					update(scope);
				};

			}
		};
	});