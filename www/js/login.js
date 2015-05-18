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
  .controller('LoginCtrl', ['$scope', function($scope) {

    $scope.model = {
      user: new Input('Username:', ''),
      password: new Input('Password:', ''),
      message: '',
      login: new Command('Login', login)
    };

    function login()
    {
      alert('login');
    }

  }]);
