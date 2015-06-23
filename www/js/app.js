angular.module('aima', ['ionic', 'aima.services'])
	.value('about', { name: 'AIMA Mobile', version: '1.0', status: 'alpha' })
	.config(['$ionicConfigProvider', '$stateProvider', '$urlRouterProvider', function($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

		$ionicConfigProvider.views.transition('none');
		//$ionicConfigProvider.scrolling.jsScrolling(false);

		$stateProvider
			.state('test', { url: '/test', templateUrl: 'views/test.html', controller: 'TestCtrl' })

			.state('start', { url: '/start', templateUrl: 'views/start.html', controller: 'StartCtrl' })
			.state('login', { url: '/login', templateUrl: 'views/login.html', controller: 'LoginCtrl' })
			.state('help', { url: '/help', templateUrl: 'views/help.html', controller: 'HelpCtrl' })
			.state('main', { url: '/main', templateUrl: 'views/main.html', abstract: true, controller: 'MainCtrl' })
			.state('main.home', { url: '/home', views: { 'menuContent': { templateUrl: 'views/main-home.html', controller: 'HomeCtrl' } } })
			.state('main.activities', { url: '/activities?year&month', views: { 'menuContent': { templateUrl: 'views/main-activities.html', controller: 'ActivitiesCtrl' } } })
			.state('main.activities_settings', { url: '/activities_settings', views: { 'menuContent': { templateUrl: 'views/main-activities-settings.html', controller: 'ActivitiesSettingsCtrl' } } })
			.state('main.activities_edit', { url: '/activities_edit/:id', views: { 'menuContent': { templateUrl: 'views/main-activities-edit.html', controller: 'ActivitiesEditCtrl' } } })
			.state('main.projects', { url: '/projects', views: { 'menuContent': { templateUrl: 'views/main-projects.html', controller: 'ProjectsCtrl' } } })
			.state('main.projects_settings', { url: '/projects_settings', views: { 'menuContent': { templateUrl: 'views/main-projects-settings.html', controller: 'ProjectsSettingsCtrl' } } })
			//.state('main.projects_edit', { url: '/projects_edit/:id', views: { 'menuContent': { templateUrl: 'views/main-projects-edit.html', controller: 'ProjectsEditCtrl' } } })
			.state('main.manual', { url: '/manual', views: { 'menuContent': { templateUrl: 'views/main-manual.html', controller: 'ManualCtrl' } } })
			.state('main.about', { url: '/about', views: { 'menuContent': { templateUrl: 'views/main-about.html', controller: 'AboutCtrl' } } })
			.state('main.profile', { url: '/profile', views: { 'menuContent': { templateUrl: 'views/main-profile.html', controller: 'ProfileCtrl' } } })

			.state('main.projects_edit', { url: '/projects_edit/:id', abstract: true, views: { 'menuContent': { templateUrl: 'views/main-projects-edit.html', controller: 'ProjectEditCtrl' } } })
			.state('main.projects_edit.info', { url: '/info', views: { 'infoTab': { templateUrl: 'views/main-projects-edit-info.html', controller: 'ProjectEditInfoCtrl' } } })
			.state('main.projects_edit.tasks', { url: '/tasks', views: { 'tasksTab': { templateUrl: 'views/main-projects-edit-tasks.html', controller: 'ProjectEditTasksCtrl' } } })
			.state('main.projects_edit.team', { url: '/team', views: { 'teamTab': { templateUrl: 'views/main-projects-edit-team.html', controller: 'ProjectEditTeamCtrl' } } });

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


function InfiniteList(hasMore, fetchMore)
{
	this.items = [];
	this.count = -1;
	this.retrieved = 0;
	this.hasMore = hasMore;
	this.fetchMore = fetchMore;
}