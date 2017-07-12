
/**
 * @ngdoc service
 * @name AttributesService
 * @module app.shared.models
 *
 * @description
 *
 * @makes attributes available for app
 */

export default function AttributesService(AttributeRepository, $log, $q) {

  return self = {

    _attributes: false,
    _defered: false,

    /**
     * Get all attributes
     */
    getAll: function() {

      var self = this;

      if(self._defered) {
        return self._defered.promise;
      }

      self._defered = $q.defer();
      
      AttributeRepository.get()
        .then(
          function(attributes){
            self._attributes = attributes;
            self._defered.resolve(self._attributes);
            return attributes;
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

      if(!self._attributes) {
        self.getAll().then(function(attributes){
          var attribute = attributes.findWhere({id: id});
          if(attribute){
            defered.resolve(attribute);
          } else {
            defered.reject("There is no attribute with that ID");
          }
          return attributes;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var attribute = self._attributes.findWhere({id: id});
      if(attribute){
        defered.resolve(attribute);
      } else {
        defered.reject("There is no attribute with that ID");
      }
      
      return defered.promise;
    },

    getByCode: function(code) {
      var self = this;
      var defered = $q.defer();

      if(!self._attributes) {
        self.getAll().then(function(attributes){
          var attribute = attributes.findWhere({code: code});
          if(attribute){
            defered.resolve(attribute);
          } else {
            defered.reject("There is no attribute with that code");
          }
          return attributes;
        }, function(errors){
          defered.reject(errors);
          return errors;
        });

        return defered.promise;
      }

      var attribute = self._attributes.findWhere({code: code});
      if(attribute){
        defered.resolve(attribute);
      } else {
        defered.reject("There is no attribute with that code");
      }
      
      return defered.promise;
    }

  };

}

AttributesService.$inject = [
  'AttributeRepository',
  '$log',
  '$q'
];