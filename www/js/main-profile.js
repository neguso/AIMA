angular.module('aima')
	.controller('ProfileCtrl', ['$scope', 'settings', function($scope, settings) {

		$scope.model = {
			autologin: true
		};


		function load()
		{
			$scope.model.autologin = settings.get('profile.autologin', true);
		}

		function save()
		{
			settings.set('profile.autologin', $scope.model.autologin);
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});

		$scope.$on('$ionicView.beforeLeave', function() {
			save();
		});
	}]);
