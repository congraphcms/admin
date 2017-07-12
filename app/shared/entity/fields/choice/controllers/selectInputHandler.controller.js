
import _ from 'underscore';

export default class SelectInputHandlerController{

  constructor($scope, $rootScope, $state, $stateParams, $q, $timeout) {

    /* jshint validthis: true */
    var handler = this;

    handler.$scope = $scope;
    handler.$rootScope = $rootScope;
    handler.$state = $state;
    handler.$stateParams = $stateParams;
    handler.$q = $q;
    handler.$timeout = $timeout;

    handler.attribute = handler.$scope.attribute;
    handler.entity = handler.$scope.entity;

    handler.init();
  }

  init() {
    var handler = this;
    
    handler.fieldCode = handler.attribute.get('code');
    handler.fieldName = handler.attribute.get('admin_label');
    handler.required = handler.attribute.get('required');
    handler.unique = handler.attribute.get('unique');

    if(handler.entity.isNew()) {
      handler.setDefaultValue();
    }

  }

  setDefaultValue() {
    var handler = this;
    var defaultValue = null;
    _.each(handler.attribute.get('options'), function(option){
      if(option.default) {
        defaultValue = option.value;
      }
    });
    
    handler.entity.setField(handler.fieldCode, defaultValue);
  }
}

SelectInputHandlerController.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];