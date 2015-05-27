angular.module('aima')
  .controller('ActivitiesSettingsCtrl', ['$scope', function($scope) {

    $scope.model = {
      sorting: 'ascending',
      interval: 'week',
      grouping: 'day'
    };

  }]);
