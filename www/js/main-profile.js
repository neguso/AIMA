angular.module('aima')
	.controller('ProfileCtrl', ['$scope', 'settings', function($scope, settings) {

		$scope.model = {
			_autologin: true
		};

		Object.defineProperty($scope.model, 'autologin', {
			configurable: false,
			enumerable: true,
			get: function() { return $scope.model._autologin; },
			set: function(value) { $scope.model._autologin = value; save(); }
		});


		function load()
		{
			$scope.model._autologin = settings.get('profile.autologin', true);
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
