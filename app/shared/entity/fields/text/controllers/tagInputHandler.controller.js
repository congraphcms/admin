
import _ from 'underscore';

export default class TagInputHandlerController{
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

    var value = handler.entity.getField(handler.fieldCode);

    if(!_.isArray(value)) {
      value = [];
      handler.entity.setField(handler.fieldCode, value)
    }
    if(handler.entity.isNew()) {
      handler.setDefaultValue();
    }

  }

  setDefaultValue() {
    var handler = this;
    var defaultValue = handler.attribute.get('default_value');
    if(defaultValue) {
      handler.entity.setField(handler.fieldCode, [defaultValue]);
    }
  }
}

TagInputHandlerController.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];