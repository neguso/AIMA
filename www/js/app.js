angular.module('aima', ['ionic', 'aima.services'])
	.config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

		$ionicConfigProvider.views.transition('none');
		//$ionicConfigProvider.scrolling.jsScrolling(false);

		$stateProvider
			.state('start', { url: '/start', templateUrl: 'views/start.html', controller: 'StartCtrl' })
			.state('login', { url: '/login', templateUrl: 'views/login.html', controller: 'LoginCtrl' })
			.state('help', { url: '/help', templateUrl: 'views/help.html', controller: 'HelpCtrl' })
			.state('main', { url: '/main', templateUrl: 'views/main.html', abstract: true, controller: 'MainCtrl' })
			.state('main.home', { url: '/home', views: { 'menuContent': { templateUrl: 'views/main-home.html', controller: 'HomeCtrl' } } })
			.state('main.activities', { url: '/activities', views: { 'menuContent': { templateUrl: 'views/main-activities.html', controller: 'ActivitiesCtrl' } } })
			.state('main.activities_settings', { url: '/activities_settings', views: { 'menuContent': { templateUrl: 'views/main-activities-settings.html', controller: 'ActivitiesSettingsCtrl' } } })
			.state('main.activities_edit', { url: '/activities_edit/:id', views: { 'menuContent': { templateUrl: 'views/main-activities-edit.html', controller: 'ActivitiesEditCtrl' } } })
			.state('main.projects', { url: '/projects', views: { 'menuContent': { templateUrl: 'views/main-projects.html', controller: 'ProjectsCtrl' } } })
			.state('main.manual', { url: '/manual', views: { 'menuContent': { templateUrl: 'views/main-manual.html', controller: 'ManualCtrl' } } })
			.state('main.about', { url: '/about', views: { 'menuContent': { templateUrl: 'views/main-about.html', controller: 'AboutCtrl' } } })
			.state('main.profile', { url: '/profile', views: { 'menuContent': { templateUrl: 'views/main-profile.html', controller: 'ProfileCtrl' } } });
		$urlRouterProvider.otherwise("/start");
	}])
	.controller('AppCtrl', ['$rootScope', function($rootScope) {

		ionic.Platform.ready(function() {

			// listen for network state changes
			ionic.EventController.on('online', function() {
				$rootScope.$broadcast('network:online');
			}, document);

			// hide splash
			navigator.splashscreen.hide();
		});

	}]);



// common view models building blocks

function Input(label, value)
{
	this.label = label;
	this.value = value;
}


function Command(icon, label, handler)
{
	this.icon = icon;
	this.label = label;
	this.handler = handler;
}


function List()
{
	this.items = [];
}


function InfiniteList()
{
	this.items = [];
	this.count = -1;
	this.hasMore = function() { return false; };
	this.fetchMore = function() { };
}