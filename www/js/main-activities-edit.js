angular.module('aima')
	.controller('ActivitiesEditCtrl', ['$scope', '$stateParams', '$q', 'activities', function($scope, $stateParams, $q, activities) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | edit.ready | edit.error
			loading: { message: '' },
      error: { message: 'Check your connection and try again.', retry: new Command('Retry', retry) },
			
			id: 0,
			reload: new Command('Reload', reload),
			edit: new Command('Edit', edit),
			save: new Command('Save', save)
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