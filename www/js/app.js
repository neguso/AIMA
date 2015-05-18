angular.module('AIMA', ['ionic'])
	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('start', { url: '/start', templateUrl: 'views/start.html', controller: 'StartCtrl' })
			.state('help', { url: '/help', templateUrl: 'views/help.html', controller: 'HelpCtrl' });

    $urlRouterProvider.otherwise("/start");
	}])
	.controller('AppCtrl', [function() {

		ionic.Platform.ready(function() {
			navigator.splashscreen.hide();
		});

	}]);