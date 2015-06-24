angular.module('aima')
  .controller('HomeCtrl', ['$scope', '$q', '$state', 'activities', 'projects', 'edit-project', function($scope, $q, $state, activities, projects, edit_project) {

    $scope.model = {
      status: 'loading', // loading | error | content.ready | content.refresh
      loading: { message: 'loading...' },
      error: { message: 'Check your connection and try again.', retry: new Command(null, 'Retry', retry) },

      refresh: refresh,
      activities: null,
      projects: null,
			
			viewActivities: viewActivities,
			viewProject: viewProject
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

    function refresh()
    {
      $scope.model.status = 'content.refresh';
      compose()
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

		function compose()
    {
      var p1 = activities.summary([new Date(2015, 6, 1), new Date(2015, 5, 1), new Date(2015, 4, 1)]);
      var p2 = projects.assigned(new Date());

      p1
        .then(function(result) {
          $scope.model.activities = result.sort(function(a, b) {
            if(a.month < b.month) return -1;
            if(a.month > b.month) return 1;
            return 0;
          }).map(function(item) {
            return { month: item.month, interval: moment(item.month).format('MMMM, YYYY'), hours: item.hours, total: item.total };
          });
        })
        .catch(function(error) {
        });

      p2
        .then(function(result) {
          $scope.model.projects = result.map(function(item) {
            return { id: item.id, name: item.name, customer: item.customer, status: item.status };
          });
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

		function viewActivities(month)
		{
			$state.go('main.activities', { year: month.getFullYear(), month: month.getMonth() });
		}

		function viewProject(project)
		{
			edit_project.id = project.id;
			$state.go('main.projects_edit.info');
		}


    $scope.$on('$ionicView.enter', function() {
      load();
    });
  }]);
