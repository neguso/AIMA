angular.module('aima')
  .controller('ActivitiesCtrl', ['$scope', '$state', '$q', 'activities', function($scope, $state, $q, activities) {

    $scope.model = {
      status: 'loading', // loading | error | content.ready | content.refresh | content.error
      loading: { message: '' },
      error: { message: 'Check your connection and try again.', retry: new Command('Retry', retry) },

			settings: settings,
			
      week: new Date(),
      take: 20,
      list: new InfiniteList(),
      refresh: refresh,
      error_more: { message: 'Check your connection and try again.', retry: new Command('Retry', retry_more) }
    };


		function settings()
		{
			//debugger;
			$state.go('main_activities_settings');
		}

    function load()
    {
      // setup model
      $scope.model.week.setDate($scope.model.week.getDate() - $scope.model.week.getDay() + 1);
      $scope.model.list.hasMore = hasMore;
      $scope.model.list.fetchMore = fetchMore;

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
      if($scope.model.status === 'error')
      {
        $scope.model.list.items.length = 0;
      }

      $scope.model.status = 'content.refresh';
      compose()
        .then(function() {
          $scope.model.status = 'content.ready';
        })
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        });
      $scope.$digest();
    }

    function compose()
    {
      var p1 = activities.get(0, $scope.model.take, $scope.model.week);

      p1
        .then(function(result) {
          var items = result.activities
            .sort(function(a, b) {
              if(a.day < b.day) return -1;
              if(a.day > b.day) return 1;
              return 0;
            });

          var activities = [], previous = new Date(1970, 0, 1), header = null;
          items.forEach(function(item) {
            if(item.day.valueOf() != previous.valueOf())
              activities.push(header = { header: true, weekday: moment(item.day).format('dddd, D MMM'), duration: 0, overtime: 0 });
            activities.push({ header: false, day: item.day, project: item.project, task: item.task, duration: item.duration, overtime: item.overtime });
            header.duration += item.duration;
            header.overtime += item.overtime;
            previous = item.day;
          });

          $scope.model.list.items = activities;
          $scope.model.list.count = result.count;
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

    function more()
    {
      var p = activities.get($scope.model.list.items.length, $scope.model.take, $scope.model.week);

      p.then(function(result) {
        var items = result.activities.map(function(item) {
          return { weekday: moment(item.day).format('dddd'), project: item.project, task: item.task, duration: item.duration, overtime: item.overtime };
        });
        Array.prototype.push.apply($scope.model.list.items, items);
      })
      .catch(function(error) {
        more_error();
      });

      return p;
    }

    function more_error()
    {
      $scope.model.status = 'content.error';
    }

    function hasMore()
    {
      return $scope.model.status !== 'content.error' && $scope.model.list.items.length < $scope.model.list.count;
    }

    function fetchMore()
    {
      $scope.model.status = 'content.refresh';
      more()
        .then(function() {
          $scope.model.status = 'content.ready';
        })
        .finally(function() {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        });
    }

    function retry_more()
    {
      $scope.model.status = 'content.ready';
    }


    $scope.$on('$ionicView.enter', function() {
      load();
    });
  }]);
