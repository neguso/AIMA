angular.module('aima')
	.controller('AboutCtrl', ['$scope', 'about', function($scope, about) {

		$scope.model = {
			application: about.name,
			version: about.version + ' ' + about.status
		};

	}]);