angular.module('aima', ['ionic', 'aima.services'])
  .config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    $ionicConfigProvider.views.transition('none');

    $stateProvider
      .state('start', { url: '/start', templateUrl: 'views/start.html', controller: 'StartCtrl' })
      .state('login', { url: '/login', templateUrl: 'views/login.html', controller: 'LoginCtrl' })
      .state('help', { url: '/help', templateUrl: 'views/help.html', controller: 'HelpCtrl' });
    $urlRouterProvider.otherwise("/start");
  }])
  .controller('AppCtrl', [function() {

    ionic.Platform.ready(function() {
      navigator.splashscreen.hide();
    });

  }]);
