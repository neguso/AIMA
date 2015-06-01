angular.module('aima')
  .controller('StartCtrl', ['$scope', '$state', '$ionicHistory', 'identity', function($scope, $state, $ionicHistory, identity) {

    $scope.model = {
      status: 'loading', // loading | error | content.ready
      loading: { message: 'loading...' },
      error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
      //
      message: ''
    };


    function load()
    {
      // nothing to load
      $scope.model.status = 'content.ready';

      authenticate();
    }

    function retry()
    {
      $scope.model.status = 'content.ready';

      authenticate();
    }

    function online()
    {
      if($scope.model.status === 'error')
      {
        retry();
        $scope.$digest();
      }
    }

    function authenticate()
    {
      $scope.model.message = 'authenticating...';
      identity.check()
        .then(function(valid) {
          $ionicHistory.nextViewOptions({ disableBack: true });
          if(valid)
            $state.go('main.home');
          else
            $state.go('login');
        })
        .catch(function() {
          check_error();
        });
    }

    function check_error()
    {
      $scope.model.status = 'error';
    }


    $scope.$on('$ionicView.enter', function() {
      load();
    });

    $scope.$on('network:online', function() {
      online();
    });

  }]);
