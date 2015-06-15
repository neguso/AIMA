angular.module('aima')
	.controller('ActivitiesEditCtrl', ['$scope', '$stateParams', '$ionicLoading', '$timeout', '$q', 'activities', 'projects', '$ionicModal', function($scope, $stateParams, $ionicLoading, $timeout, $q, activities, projects, $ionicModal) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | edit.ready | edit.error
			loading: { message: 'loading...' },
      error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

			error_save: { message: 'Error saving activity.' },
			message_save: '',

			message_view: { text: '', color: null },
			message_edit: { text: '', color: null },

			reload: new Command('ion-refresh', 'Reload', reload),
			edit: new Command('ion-compose', 'EDIT', edit),
			save: new Command('ion-checkmark-round', 'SAVE', save),
			
			id: 0,
			activity: null,
			projects: [],
			validation: [],
			selectProject: selectProject,
			selectTask: selectTask
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

		function compose()
		{
			var p1;
			if($scope.model.id === 0)
				p1 = activities.create();
			else
				p1 = activities.load($scope.model.id);
			p1
        .then(function(result) {
					$scope.model.activity = result;
        })
        .catch(function(error) {
        });

			var p2 = projects.assigned(null);
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

		function save()
		{
			if(!validate()) return;

			$ionicLoading.show({ animation: 'fade-in', templateUrl: 'spinner.html' });

      activities.update($scope.model.activity)
				.then(function(result) {
					if(result.status === 'added')
					{
						$scope.model.status = 'content.ready';
						$scope.model.message_view.text = 'Activity created.';
						$scope.model.message_view.color = '#4CAF50';
						$timeout(function() { $scope.model.message_save = ''; }, 3000);
					}
					else if(result.status === 'updated')
					{
						$scope.model.status = 'content.ready';
						$scope.model.message_view.text = 'Activity updated.';
						$scope.model.message_view.color = '#4CAF50';
						$timeout(function() { $scope.model.message_save = ''; }, 3000);
					}
					else if(result.status === 'not-found')
					{
						$scope.model.status = 'edit.error';
						$scope.model.message_edit.text = 'Error saving activity. Activity no longer exists.';
						$scope.model.message_view.color = '#F44336';
					}
					else
					{
						$scope.model.status = 'edit.error';
						$scope.model.message_edit.text = 'Error saving activity.';
						$scope.model.message_view.color = '#F44336';
					}
				})
				.catch(function() {
					$scope.model.status = 'edit.error';
					$scope.model.message_edit.text = 'Error saving activity.';
					$scope.model.message_view.color = '#F44336';
				})
				.finally(function() {
					$ionicLoading.hide();
				});
		}

		function validate()
		{
			$scope.model.validation.length = 0;
			
			// check date
			
			// check project
			if($scope.model.activity.project === null)
				$scope.model.validation.push({ field: 'project', error: 'Project not specified.' });
			
			// check task
			if($scope.model.activity.task === null)
				$scope.model.validation.push({ field: 'task', error: 'Task not specified.' });
			
			// check duration
			
			// check overtime
			
			// check notes
			if($scope.model.activity.notes === null || $scope.model.activity.notes.trim().length === 0)
				$scope.model.validation.push({ field: 'notes', error: 'Notes not specified.' });

			//
			if($scope.model.validation.length > 0)
			{
				$scope.model.status = 'edit.error';
				$scope.model.message_edit.text = 'Invalid data, check highlighted fields.';
				$scope.model.message_view.color = '#F44336';
			}
			
			return $scope.model.validation.length === 0;
		}

		function selectProject()
		{
			$scope.projectSelectorModal.show();
		}
		
		function selectTask()
		{
			
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);