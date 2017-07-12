
/**
 * @ngdoc service
 * @name AttributeSets
 * @module app.shared.models
 *
 * @description
 *
 * @makes attribute sets available for app
 */

// import angular from 'angular';

export default function AttributeSetsService(
  AttributeSetRepository, 
  AttributeSetCollection, 
  $log, 
  $q
) {

  return self = {

    _sets: false,
    _defered: false,

    /**
     * Get all attribute sets
     */
    getAll: function() {

      var self = this;

      if(self._defered) {
        return self._defered.promise;
      }

      self._defered = $q.defer();
      
      AttributeSetRepository.get({
        include: 'attributes'
      })
        .then(
          function(sets){
            self._sets = sets;
            self._defered.resolve(self._sets);
            return sets;
          }, 
          function(errors){
            self._defered.reject(errors);
            return errors;
          }
        );

      return self._defered.promise;
    },

    /**
     * Get attribute set by ID
     */
    getById: function(id) {
      var self = this;
      var defered = $q.defer();

      if(!self._sets) {
        self.getAll().then(function(sets){
          var set = sets.findWhere({id: id});
          if(set){
            defered.resolve(set);
          } else {
            defered.reject("There is no attribute set with that ID");
          }
          return sets;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var set = self._sets.findWhere({id: id});
      if(set){
        defered.resolve(set);
      } else {
        defered.reject("There is no attribute set with that ID");
      }
      
      return defered.promise;
    },

    /**
     * Get attribute set by code
     */
    getByCode: function(code) {
      var self = this;
      var defered = $q.defer();

      if(!self._sets) {
        self.getAll().then(function(sets){
          var set = sets.findWhere({code: code});
          if(set){
            defered.resolve(set);
          } else {
            defered.reject("There is no attribute set with that code");
          }
          return sets;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var set = self._sets.findWhere({code: code});
      if(set){
        defered.resolve(set);
      } else {
        defered.reject("There is no attribute set with that code");
      }
      
      return defered.promise;
    },

    /**
     * Get attribute sets by type
     */
    getByType: function(id) {
      var self = this;
      var defered = $q.defer();

      if(!self._sets) {
        self.getAll().then(function(sets){
          var sets = sets.where({entity_type_id: id});
          var collection = new AttributeSetCollection(sets);
          defered.resolve(collection);

          return sets;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var sets = self._sets.where({entity_type_id: id});
      var collection = new AttributeSetCollection(sets);
      defered.resolve(collection);
      
      return defered.promise;
    }

  };

}

AttributeSetsService.$inject = [
  'AttributeSetRepository',
  'AttributeSetCollection',
  '$log',
  '$q'
];