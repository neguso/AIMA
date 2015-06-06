angular.module('aima')
	.controller('ActivitiesEditCtrl', ['$scope', '$stateParams', '$ionicLoading', '$timeout', '$q', 'activities', function($scope, $stateParams, $ionicLoading, $timeout, $q, activities) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | edit.ready | edit.error
			loading: { message: '' },
      error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
			error_save: { message: 'Error saving activity.' },
			message_save: '',

			id: 0,
			reload: new Command('ion-refresh', 'Reload', reload),
			edit: new Command('ion-compose', 'EDIT', edit),
			save: new Command('ion-checkmark-round', 'SAVE', save)
		};

		function load()
		{
			$scope.model.status = 'loading';
			compose()
        .then(function() {
          $scope.model.status = 'content.ready';
        });
		}

		function retry()
		{
			$scope.model.status = 'loading';
      compose()
        .then(function() {
          $scope.model.status = 'content.ready';
        });
		}

		function reload()
		{
		}

		function edit()
		{
			$scope.model.status = 'edit.ready';
		}

		function save()
		{
			$ionicLoading.show({ animation: 'fade-in', templateUrl: 'spinner.html' });

      activities.update()
				.then(function() {
					$scope.model.status = 'content.ready';
					$scope.model.message_save = 'Activity saved.';
					$timeout(function() { $scope.model.message_save = ''; }, 3000);
				})
				.catch(function() {
					$scope.model.status = 'edit.error';
				})
				.finally(function() {
					$ionicLoading.hide();
				});
		}

		function compose()
		{
			var p1 = activities.load($scope.model.id);

      p1
        .then(function(result) {
         // fill form
        })
        .catch(function(error) {
        });

      var all = $q.all([p1]);
      all
        .catch(function(error) {
          compose_error();
        });

      return all;
		}
		
		function compose_error()
		{
			$scope.model.status = 'error';
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);