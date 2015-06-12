angular.module('aima')
	.controller('TestCtrl', ['$scope', function($scope) {

		$scope.date = new Date(2015, 1, 23);

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
	
		function weeks(date)
		{
			var day = moment(date).startOf('month').startOf('week');
			var ary = [];
			for(var w = 0; w < 6; w++)
			{
				var week = [];
				for(var d = 0; d < 7; d++)
				{
					week.push({ text: day.format('D'), date: day.toDate() });
					day.add(1, 'd');
				}
				ary.push(week);
			}
			return ary;
		}
	
		return {
			restrict: 'E',
			scope: {
				date: '=date'
			},
			templateUrl: 'views/aima-calendar.html',
			link: function(scope, element) {
				var m = moment(scope.date);
				scope.value = m.format('dddd, D MMMM, YYYY');
				scope.header = m.format('MMMM, YYYY');
				scope.names = names(scope.date);
				scope.weeks = weeks(scope.date);
			}
		};
	});