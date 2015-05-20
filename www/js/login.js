function Input(label, value)
{
	this.label = label;
	this.value = value;
}

function Command(label, handler)
{
	this.label = label;
	this.handler = handler;
}




angular.module('aima')
	.controller('LoginCtrl', ['$scope', '$state', '$ionicLoading', 'identity', function($scope, $state, $ionicLoading, identity) {

		$scope.model = {
			user: new Input('Username:', 'a'),
			password: new Input('Password:', 'a'),
			message: '',
			login: new Command('Login', login)
		};

		function login()
		{
			$ionicLoading.show({ animation: 'fade-in', templateUrl: 'spinner.html' });

			identity.authenticate($scope.model.user.value, $scope.model.password.value)
				.then(
					function(token) {
						login_ok();
					},
					function(error) {
						login_fail();
					},
					function() { }
				);
		}

		function login_fail()
		{
			$ionicLoading.hide();
			$scope.model.message = 'Invalid login credentials';
		}

		function login_ok()
		{
			$ionicLoading.hide();
			$state.go('main.home');
		}

	}]);
