
/**
 * @ngdoc service
 * @name AttributesService
 * @module app.shared.models
 *
 * @description
 *
 * @makes attributes available for app
 */

export default function AttributesService(AttributeRepository, $rootScope, $log, $q) {
  let _attributes = false;
  let _defered = false;

  $rootScope.$on('attributeDeleted', function(ev, attr) {
    if(!_attributes) { return; }

    var deleted = _attributes.findWhere({id: attr.get('id')});
    _attributes.remove(deleted);

  });

  return self = {

    /**
     * Get all attributes
     */
    getAll: function() {

      var self = this;

      if(_defered) {
        return _defered.promise;
      }

      _defered = $q.defer();
      
      AttributeRepository.get()
        .then(
          function(attributes){
            _attributes = attributes;
            _defered.resolve(_attributes);
            return attributes;
          }, 
          function(errors){
            _defered.reject(errors);
            return errors;
          }
        );

      return _defered.promise;
    },

    getById: function(id) {
      var self = this;
      var defered = $q.defer();

      if(!_attributes) {
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

      var attribute = _attributes.findWhere({id: id});
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

      if(!_attributes) {
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

      var attribute = _attributes.findWhere({code: code});
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
  '$rootScope',
  '$log',
  '$q'
];