angular.module('aima.services', [])
  .factory('identity', ['$q', '$timeout', function($q, $timeout) {

    var identity = {
      token: null,

      authenticate: function(username, password)
      {
        var defer = $q.defer();

        $timeout(function() {
          identity.token = 123;

          if(username === 'a' && password === 'a')
            defer.resolve(identity.token);
          else
            defer.reject();
        }, 1000);

        return defer.promise;
      },

      check: function()
      {
        var defer = $q.defer();

        if(identity.token === null)
          defer.reject();
        else
        {
          $timeout(function() {
            defer.resolve();
          }, 1000);
        }

        return defer.promise;
      }
    };

    return identity;
  }]);
