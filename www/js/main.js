angular.module('aima')
  .controller('MainCtrl', ['$scope', '$state', '$ionicHistory', 'identity', function($scope, $state, $ionicHistory, identity) {

		$scope.model = {
      menu: [
        { name: '', url: 'main.home', icon: 'ion-home', label: 'Dashboard', separator: false, selected: true },
        { name: '', url: 'main.activities', icon: 'ion-compose', label: 'My Activities', separator: false, selected: false },
        { name: '', url: 'main.projects', icon: 'ion-android-folder', label: 'My Projects', separator: false, selected: false },
        { name: '', url: 'main.manual', icon: 'ion-help-circled', label: 'Help', separator: false, selected: false },
        { name: '', url: 'main.about', icon: 'ion-information-circled', label: 'About', separator: false, selected: false },
        { name: '', url: 'main.profile', icon: 'ion-person', label: 'My Profile', separator: true, selected: false }				
      ],
			logout: { icon: 'ion-power', label: 'Logout', handler: logout },
      select: select
    };


    function select(option)
    {
      $scope.model.menu.forEach(function(item) {
        item.selected = (item === option);
      });
    }

		function logout()
		{
			select($scope.model.menu[0]);
			identity.logout();

			$ionicHistory.nextViewOptions({ disableBack: true });
			$state.go('login');
		}

	}]);