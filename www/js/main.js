angular.module('aima')
  .controller('MainCtrl', ['$scope', function($scope) {
    $scope.model = {
      menu: [
        { url: '#/main/home', icon: 'ion-home', label: 'Dashboard', separator: false, selected: true },
        { url: '#/main/activities', icon: 'ion-compose', label: 'My Activities', separator: false, selected: false },
        { url: '#/main/projects', icon: 'ion-android-folder', label: 'My Projects', separator: false, selected: false },
        { url: '#/main/help', icon: 'ion-help-circled', label: 'Help', separator: false, selected: false },
        { url: '#/main/about', icon: 'ion-information-circled', label: 'About', separator: false, selected: false },
        { url: '#', icon: 'ion-person', label: 'My Profile', separator: true, selected: false },
        { url: '#', icon: 'ion-power', label: 'Logout', separator: false, selected: false }
      ],
      select: select
    };

    function select(option)
    {
      $scope.model.menu.forEach(function(item) {
        item.selected = (item === option);
      });
    }

  }]);
