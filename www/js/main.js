angular.module('aima')
  .controller('MainCtrl', ['$scope', '$state', '$ionicHistory', 'identity', function($scope, $state, $ionicHistory, identity) {

		$scope.model = {
      menu: [
        { state: 'main.home', icon: 'ion-home', label: 'Dashboard', separator: false, selected: true },
        { state: 'main.activities', icon: 'ion-compose', label: 'My Activities', separator: false, selected: false },
        { state: 'main.projects', icon: 'ion-android-folder', label: 'My Projects', separator: false, selected: false },
        { state: 'main.manual', icon: 'ion-help-circled', label: 'Help', separator: false, selected: false },
        { state: 'main.about', icon: 'ion-information-circled', label: 'About', separator: false, selected: false },
        { state: 'main.profile', icon: 'ion-person', label: 'My Profile', separator: true, selected: false },
        { state: 'logout', icon: 'ion-power', label: 'Logout', separator: false, selected: false }
      ],
      select: select
    };


    function select(option)
    {
      $scope.model.menu.forEach(function(item) {
        item.selected = (item === option);
      });

			switch(option.state)
			{
				case 'logout': logout(); break;
				default: $state.go(option.state);
			}
    }

		function logout()
		{
			identity.logout();

			$ionicHistory.nextViewOptions({ disableBack: true });
			$state.go('login');
		}

	}]);