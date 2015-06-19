angular.module('aima')
	.controller('ActivitiesEditCtrl', ['$scope', '$stateParams', '$ionicLoading', '$timeout', '$q', 'activities', 'projects', '$ionicModal', function($scope, $stateParams, $ionicLoading, $timeout, $q, activities, projects, $ionicModal) {

		$scope.model = {
			status: 'loading', // loading | error | content.ready | edit.ready | edit.error
			loading: { message: 'loading...' },
      error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

			message_view: { visible: false },
			message_edit: { visible: false },

			reload: new Command('ion-refresh', 'Reload', reload),
			edit: new Command('ion-compose', 'EDIT', edit),
			save: new Command('ion-checkmark-round', 'SAVE', save),

			id: 0,
			activity: null,
			duration_h: 0, duration_m: 0, overtime_h: 0, overtime_m: 0,

			projects: new List(),
			tasks: new List(),
			validation: {},

			openProjects: openProjects,
			closeProjects: closeProjects,
			selectProject: selectProject,
			selectedProject: null,

			openTasks: openTasks,
			closeTasks: closeTasks,
			selectTask: selectTask,
			selectedTask: null
		};

		// create modal for project selection
		$ionicModal.fromTemplateUrl('project-selector.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modalProjects = modal;
		});

		// create modal for task selection
		$ionicModal.fromTemplateUrl('task-selector.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.modalTasks = modal;
		});


		function load()
		{
			// initialize model
			$scope.model.id = parseInt($stateParams.id);
			$scope.model.message_view = { visible: false };
			$scope.model.message_edit = { visible: false };
			
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
					$scope.model.duration_h = Math.floor($scope.model.activity.duration);
					$scope.model.duration_m = ($scope.model.activity.duration * 60) % 60;
					$scope.model.overtime_h = Math.floor($scope.model.activity.overtime);
					$scope.model.overtime_m = ($scope.model.activity.overtime * 60) % 60;
        });

			var p2 = projects.assigned(null);
			p2
				.then(function(result) {
					$scope.model.projects.items = result;
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
			// collect data
			$scope.model.activity.duration = $scope.model.duration_h + Math.round(($scope.model.duration_m / 60) * 100) / 100;
			$scope.model.activity.overtime = $scope.model.overtime_h + Math.round(($scope.model.overtime_m / 60) * 100) / 100;

			if(!validate()) return;

			$ionicLoading.show({ animation: 'fade-in', templateUrl: 'spinner.html' });

      activities.update($scope.model.activity)
				.then(function(result) {
					if(result.status === 'added')
					{
						$scope.model.status = 'content.ready';
						$scope.model.message_view = { type: 'info', title: 'Activity created.', timeout: 3000 };
					}
					else if(result.status === 'updated')
					{
						$scope.model.status = 'content.ready';
						$scope.model.message_view = { type: 'info', title: 'Activity updated.', timeout: 3000 };
					}
					else if(result.status === 'not-found')
					{
						$scope.model.status = 'edit.error';
						$scope.model.message_edit = { type: 'error', title: 'Error saving activity.', message: 'Activity no longer exists.' };
					}
					else
					{
						$scope.model.status = 'edit.error';
						$scope.model.message_edit = { type: 'error', title: 'Error saving activity.' };
					}
				})
				.catch(function() {
					$scope.model.status = 'edit.error';
					$scope.model.message_edit = { type: 'error', title: 'Error saving activity.' };
				})
				.finally(function() {
					$ionicLoading.hide();
				});
		}

		function validate()
		{
			$scope.model.validation = {};
			
			// check date
			$scope.model.validation.date = { error: 'Invalid date.' };
			
			// check project
			if($scope.model.activity.project === null)
				$scope.model.validation.project = { error: 'Project not specified.' };
			
			// check task
			if($scope.model.activity.task === null)
				$scope.model.validation.task = { error: 'Task not specified.' };
			
			// check duration & overtime
			if($scope.model.activity.duration === 0)
				$scope.model.validation.duration = { error: 'Duration not specified.' };
			else if($scope.model.activity.overtime > $scope.model.activity.duration)
				$scope.model.validation.duration = { error: 'Overtime must be less or equal with duration.' };

			// check notes
			if($scope.model.activity.notes === null || $scope.model.activity.notes.trim().length === 0)
				$scope.model.validation.notes = { error: 'Notes not specified.' };

			// validation summary
			if(Object.keys($scope.model.validation).length > 0)
			{
				$scope.model.status = 'edit.error';
				$scope.model.message_edit = { type: 'error', title: ' Some fields are incorrect or missing.', message: 'Erros are highlighted below.' };
			}

			return Object.keys($scope.model.validation).length === 0;
		}

		function getProjectById(projects, project)
		{
			if(project === null) return null;
			for(var i = 0; i < projects.length; i++)
				if(projects[i].id === project.id)
					return projects[i];
			return null;
		}
		
		function openProjects()
		{
			$scope.model.selectedProject = getProjectById($scope.model.projects.items, $scope.model.activity.project);
			$scope.modalProjects.show();
		}

		function closeProjects()
		{
			$scope.modalProjects.hide();
		}

		function selectProject()
		{
			if($scope.model.selectedProject === null) return;

			var id = $scope.model.activity.project === null ? -1 : $scope.model.activity.project.id;
			$scope.model.activity.project = { id: $scope.model.selectedProject.id, name: $scope.model.selectedProject.name };

			// reset task if project has been changed
			if(id !== $scope.model.activity.project.id)
				$scope.model.activity.task = null;

			closeProjects();
		}

		function getTaskById(tasks, task)
		{
			if(task === null) return null;
			for(var i = 0; i < tasks.length; i++)
				if(tasks[i].id === task.id)
					return tasks[i];
			return null;
		}

		function openTasks()
		{
			if($scope.model.activity.project === null) return;

			$scope.model.tasks.items = getProjectById($scope.model.projects.items, $scope.model.activity.project).tasks;
			$scope.model.selectedTask = getTaskById($scope.model.tasks.items, $scope.model.activity.task);
			$scope.modalTasks.show();
		}

		function closeTasks()
		{
			$scope.modalTasks.hide();
		}

		function selectTask()
		{
			if($scope.model.selectedTask === null) return;

			$scope.model.activity.task = { id: $scope.model.selectedTask.id, name: $scope.model.selectedTask.name };
			closeTasks();
		}


		$scope.$on('$ionicView.enter', function() {
			load();
		});
	}]);