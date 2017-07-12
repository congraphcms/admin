
/**
 * @ngdoc service
 * @name ContactQuickForm
 * @module app.components.contacts
 *
 * @description
 *
 * @returns an instance of contact quick form service
 */

require('./../styles/quickForm.scss');

import angular from 'angular';
import template from './../views/entityQuickForm.tmpl.html';

export default function EntityQuickForm($log, $q, $compile) {

  var self;
  var instances = [];
  var pendings = {}; // model.cid : deferred

  return self = {

    parent: false,
    level: 0,
    
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

    open: function(options) {
      options = options || {};
      // if(!options.parent) {
      //   throw new Error('Can not open quick form without parent element defined in options');
      // }

      if(!options.scope) {
        throw new Error('Can not open quick form without scope defined in options');
      }

      if(!options.model) {
        throw new Error('Can not open quick form without model in options');
      }

      if(!options.attributeSet) {
        throw new Error('Can not open quick form without attribute set defined in options');
      }

      if(!options.contentModel) {
        throw new Error('Can not open quick form without content model defined in options');
      }

      var instance = {
        // parent: options.parent,
        scope: options.scope,
        model: options.model,
        attributeSet: options.attributeSet,
        contentModel: options.contentModel,
        defered: $q.defer()
      };

      instance.scope.model = instance.model;
      instance.scope.attributeSet = instance.attributeSet;
      instance.scope.contentModel = instance.contentModel;

      this._renderInstance(instance);

      return instance.defered.promise;
    },

    _renderInstance: function(instance) {
      var el = angular.element(template);
      instance.element = el;
      var parent;
      if(!this.parent) {
        parent = angular.element(document.querySelector('#app-view'));
      } else {
        parent = this.parent;
      }

      parent.append(el);
      instance.parent = parent;
      this.parent = el;
      this.level++;

      instance.scope.instance = instance;

      instances.push(instance);

      $compile(el)(instance.scope);
    },

    resolve: function(instance, entity) {
      instance.defered.resolve(entity);
      this.close(instance);
    },

    cancel: function(instance) {
      instance.defered.reject('form closed');
      this.close(instance);
    },

    close: function(instance) {
      console.log('close quick form', instance)
      instance.element.detach();
      instances.splice(-1, 1);
      this.level--;
      if(instances.length > 0) {
        this.parent = instances[instances.length - 1].element.find('.quick-form-backdrop');
      } else {
        this.parent = false;
      }
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
      return model.cid;
    }
    return model;
  }

}

EntityQuickForm.$inject = [
  '$log',
  '$q',
  '$compile'
];