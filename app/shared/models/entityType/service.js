
/**
 * @ngdoc service
 * @name EntityTypes
 * @module app.shared.models
 *
 * @description
 *
 * @makes entity types available for app
 */

// import angular from 'angular';

export default function EntityTypesService(EntityTypeRepository, $log, $q) {

  return self = {

    _types: false,
    _defered: false,

    /**
     * Get all entity types
     */
    getAll: function() {

      var self = this;

      if(self._defered) {
        return self._defered.promise;
      }

      self._defered = $q.defer();
      
      EntityTypeRepository.get({
        include: 'workflow.points'
      })
        .then(
          function(types){
            self._types = types;
            self._defered.resolve(self._types);
            return types;
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

      if(!self._types) {
        self.getAll().then(function(types){
          var type = types.findWhere({id: id});
          if(type){
            defered.resolve(type);
          } else {
            defered.reject("There is no entity type with that ID");
          }
          return types;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var type = self._types.findWhere({id: id});
      if(type){
        defered.resolve(type);
      } else {
        defered.reject("There is no entity type with that ID");
      }
      
      return defered.promise;
    },

    getByCode: function(code) {
      var self = this;
      var defered = $q.defer();

      if(!self._types) {
        self.getAll().then(function(types){
          var type = types.findWhere({code: code});
          if(type){
            defered.resolve(type);
          } else {
            defered.reject("There is no entity type with that code");
          }
          return types;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var type = self._types.findWhere({code: code});
      if(type){
        defered.resolve(type);
      } else {
        defered.reject("There is no entity type with that code");
      }
      
      return defered.promise;
    }

  };

}

EntityTypesService.$inject = [
  'EntityTypeRepository',
  '$log',
  '$q'
];