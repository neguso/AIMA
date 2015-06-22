angular.module('aima')
	.controller('MainCtrl', ['$scope', '$state', '$ionicHistory', 'identity', function($scope, $state, $ionicHistory, identity) {

		$scope.model = {
			menu: [
				{ url: 'main.home', icon: 'ion-home', label: 'Dashboard', separator: false },
				{ url: 'main.activities', icon: 'ion-compose', label: 'My Activities', separator: false },
				{ url: 'main.projects', icon: 'ion-android-folder', label: 'My Projects', separator: false },
				{ url: 'main.manual', icon: 'ion-help-circled', label: 'Help', separator: false },
				{ url: 'main.about', icon: 'ion-information-circled', label: 'About', separator: false },
				{ url: 'main.profile', icon: 'ion-person', label: 'My Profile', separator: true }				
			],
			logout: { icon: 'ion-power', label: 'Logout', handler: logout }
		};


		function logout()
		{
			identity.logout();

			$ionicHistory.nextViewOptions({ disableBack: true });
			$state.go('login');
		}

	}]);