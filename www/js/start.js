angular.module('aima')
  .controller('StartCtrl', ['$scope', '$state', 'identity', function($scope, $state, identity) {

		$scope.model = {
			message: ''
		};
		
    $scope.$on('$ionicView.enter', function() {

			$scope.model.message = 'authenticating...';
      identity.check()
        .then(function() { $state.go('main.home'); })
				.catch(function() { $state.go('login'); });

    });

  }]);