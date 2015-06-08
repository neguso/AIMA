angular.module('aima')
	.controller('ActivitiesEditCtrl', ['$scope', '$stateParams', '$ionicLoading', '$timeout', '$q', 'activities', 'projects', '$ionicModal', function($scope, $stateParams, $ionicLoading, $timeout, $q, activities, projects, $ionicModal) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | edit.ready | edit.error
			loading: { message: '' },
      error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },
			error_save: { message: 'Error saving activity.' },
			message_save: '',

			reload: new Command('ion-refresh', 'Reload', reload),
			edit: new Command('ion-compose', 'EDIT', edit),
			save: new Command('ion-checkmark-round', 'SAVE', save),
			
			id: 0,
			activity: null,
			projects: [],
			selectProject: selectProject
		};

		$ionicModal.fromTemplateUrl('project-selector.html', {
				scope: $scope,
				animation: 'slide-in-up'
			}).then(function(modal) {
				$scope.projectSelectorModal = modal;
			});
		
		
		function load()
		{
			$scope.model.status = 'loading';
			compose()
        .then(function() {
					if($scope.model.id === 0)
						$scope.model.status = 'edit.ready';
					else
          	$scope.model.status = 'content.ready';
        });
		}

		function retry()
		{
			$scope.model.status = 'loading';
      compose()
        .then(function() {
          if($scope.model.id === 0)
						$scope.model.status = 'edit.ready';
					else
          	$scope.model.status = 'content.ready';
        });
		}

		function reload()
		{
			$scope.model.status = 'loading';
			$scope.model.activity = null;
      compose()
        .then(function() {
          if($scope.model.id === 0)
						$scope.model.status = 'edit.ready';
					else
          	$scope.model.status = 'content.ready';
        });
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
			var p1;
			if($scope.model.id === 0)
				p1 = activities.create();
			else
				p1 = activities.load($scope.model.id);

			var p2 = projects.assigned(null);
			
      p1
        .then(function(result) {
					$scope.model.activity = result;
        })
        .catch(function(error) {
        });

			p2
				.then(function(result) {
					$scope.model.projects = result;
        })
        .catch(function(error) {
        });

      var all = $q.all([p1, p2]);
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

		function selectProject()
		{
			$scope.projectSelectorModal.show();
		}

		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);