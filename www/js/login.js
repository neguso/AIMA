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
      status: 'loading', // loading | error | content.ready
      loading: { message: '' },
      error: { message: 'Check your connection and try again.', retry: new Command('Retry', retry) },

      user: new Input('Username:', 'a'),
      password: new Input('Password:', 'a'),
      message: '',
      login: new Command('Login', login)
    };


    function load()
    {
      // nothing to load
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
        .then(
          function(token) {
            if(token === null)
              login_fail();
            else
              login_ok();
          },
          function(error) {
            login_error();
          }
        );
    }

    function login_fail()
    {
      $ionicLoading.hide();
      $scope.model.message = 'Invalid login credentials';
    }

    function login_error()
    {
      $ionicLoading.hide();
      $scope.model.message = 'Network connection error';
    }

    function login_ok()
    {
      $ionicLoading.hide();
      $state.go('main.home');
    }


    $scope.$on('$ionicView.enter', function() {
      load();
    });
  }]);
