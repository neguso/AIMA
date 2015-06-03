angular.module('aima')
	.controller('LoginCtrl', ['$scope', '$state', '$ionicLoading', '$ionicHistory', 'identity', function($scope, $state, $ionicLoading, $ionicHistory, identity) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready
			loading: { message: '' },
			error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

			user: new Input('User:', ''),
			password: new Input('Password:', ''),
			message: '',
			login: new Command(null, 'Login', login)
		};


		function load()
		{
			// init model
			$scope.model.user.value = 'a';
			$scope.model.password.value = 'a';
			$scope.model.message = '';

			$scope.model.status = 'content.ready';
		}

		function retry()
		{
			// not supported
		}

		function refresh()
		{
			// not supported
		}

		function login()
		{
			$ionicLoading.show({ animation: 'fade-in', templateUrl: 'spinner.html' });

			identity.authenticate($scope.model.user.value, $scope.model.password.value)
				.then(function(token) {
					if(token === null)
						login_fail();
					else
						login_ok();
				})
				.catch(function(error) {
					login_error();
				});
		}

		function login_fail()
		{
			$ionicLoading.hide();
			$scope.model.message = 'Invalid login credentials.';
		}

		function login_error()
		{
			$ionicLoading.hide();
			$scope.model.message = 'Network connection error.';
		}

		function login_ok()
		{
			$ionicLoading.hide();
			$ionicHistory.nextViewOptions({ disableBack: true });
			$state.go('main.home');
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);