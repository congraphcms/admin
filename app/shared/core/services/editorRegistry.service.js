
/**
 * @ngdoc service
 * @name EditorRegistry
 * @module app.shared.editors
 *
 * @description
 * An Editor Service instance registration service.
 *
 * @returns an instance of editor registry
 */
export default function EditorRegistry($log, $q) {

  var self;
  var instances = {};
  var pendings = {}; // model.cid : deferred

  return self = {
    
    /**
     * Used to print an error when an instance for a model isn't found.
     */
    notFoundError: function(model) {
      $log.error('No instance found for model', model);
    },
    
    /**
     * Return all registered instances as an array.
     */
    getInstances: function() {
      return instances;
    },

    /**
     * Get a registered instance.
     * @param model the AttributeModel to look up for a registered instance.
     */
    get: function(model) {
      var id = identity(model);

      var instance = instances[id];
      return instance || null;
    },

    /**
     * Register an instance.
     * @param instance the instance to register
     * @param model the model to identify the instance for.
     */
    register: function(instance, model) {
      if ( !model || !instance) return angular.noop;
      
      var id = identity(model);

      instances[id] = instance;
      resolveWhen();

      return deregister;

      /**
       * Remove registration for an instance
       */
      function deregister() {
        delete instances[identity(model)];
      }

      /**
       * Resolve any pending promises for this instance
       */
      function resolveWhen() {
        var deferred = pendings[id];
        if ( deferred ) {
          deferred.resolve( instance );
          delete pendings[id];
        }
      }
    },

    /**
     * Async accessor to registered service instance
     * If not available then a promise is created to notify
     * all listeners when the instance is registered.
     */
    when: function(model) {
      var id = identity(model);
      var deferred = $q.defer();
      var instance = self.get(model);

      if (instance) {
        deferred.resolve(instance);
      } else {
        pendings[id] = deferred;
      }

      return deferred.promise;
    }

  };

  function isValidModel(model){
    return model && ( model instanceof CB.Model );
  }

  function identity(model){
    if(isValidModel(model)){
      return model.isNew() ? model.cid : model.id;
    }
    return model;
  }

}

EditorRegistry.$inject = [
  '$log',
  '$q'
];