
/**
 * @ngdoc service
 * @name UsersService
 * @module app.shared.models
 *
 * @description
 *
 * @makes users available for app
 */

// import angular from 'angular';

export default function UsersService(UserRepository, $log, $q) {

  return self = {

    _users: false,
    _defered: false,

    /**
     * Get all users
     */
    getAll: function() {

      var self = this;

      if(self._defered) {
        return self._defered.promise;
      }

      self._defered = $q.defer();
      
      UserRepository.get()
        .then(
          function(users){
            self._users = users;
            self._defered.resolve(self._users);
            return users;
          }, 
          function(errors){
            self._defered.reject(errors);
            return errors;
          }
        );

      return self._defered.promise;
    },

    getById: function(id) {
      var self = this;
      var defered = $q.defer();

      if(!self._users) {
        self.getAll().then(function(users){
          var user = users.findWhere({id: id});
          if(user){
            defered.resolve(user);
          } else {
            defered.reject("There is no user with that ID");
          }
          return users;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var user = self._users.findWhere({id: id});
      if(user){
        defered.resolve(user);
      } else {
        defered.reject("There is no user with that ID");
      }
      
      return defered.promise;
    },

    getByEmail: function(email) {
      var self = this;
      var defered = $q.defer();

      if(!self._users) {
        self.getAll().then(function(users){
          var user = users.findWhere({email: email});
          if(user){
            defered.resolve(user);
          } else {
            defered.reject("There is no user with that email");
          }
          return users;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var user = self._users.findWhere({email: email});
      if(user){
        defered.resolve(user);
      } else {
        defered.reject("There is no user with that email");
      }
      
      return defered.promise;
    }

  };

}

UsersService.$inject = [
  'UserRepository',
  '$log',
  '$q'
];