angular.module('aima', ['ionic', 'aima.services'])
  .config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

    $ionicConfigProvider.views.transition('none');

    $stateProvider
      .state('start', { url: '/start', templateUrl: 'views/start.html', controller: 'StartCtrl' })
      .state('login', { url: '/login', templateUrl: 'views/login.html', controller: 'LoginCtrl' })
      .state('help', { url: '/help', templateUrl: 'views/help.html', controller: 'HelpCtrl' })
      .state('main', { url: '/main', templateUrl: 'views/main.html', abstract: true })
      .state('main.home', { url: '/home', views: { 'menuContent': { templateUrl: 'views/main-home.html', controller: 'HomeCtrl' } } })
      .state('main.activities', { url: '/activities', views: { 'menuContent': { templateUrl: 'views/main-activities.html', controller: 'ActivitiesCtrl' } } })
      .state('main.projects', { url: '/projects', views: { 'menuContent': { templateUrl: 'views/main-projects.html', controller: 'ProjectsCtrl' } } })
      .state('main.about', { url: '/about', views: { 'menuContent': { templateUrl: 'views/main-about.html', controller: 'AboutCtrl' } } });
    $urlRouterProvider.otherwise("/start");
  }])
  .controller('AppCtrl', [function() {

    ionic.Platform.ready(function() {
      navigator.splashscreen.hide();
    });

  }]);
