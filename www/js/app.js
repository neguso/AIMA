angular.module('AIMA', ['ionic'])
	.controller('AppCtrl', function() {

	ionic.Platform.ready(function() {
		navigator.splashscreen.hide();
	});

});