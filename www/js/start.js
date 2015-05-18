angular.module('aima')
  .controller('StartCtrl', ['$scope', '$state', 'identity', function($scope, $state, identity) {

    $scope.$on('$ionicView.enter', function() {

      identity.authenticate('a', 'a')
        .then(function() { $state.go('login'); });

    });

  }]);
