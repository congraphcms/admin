
import _ from 'underscore';

export default class CheckboxHandlerController{

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
    var defaultValue = [];
    _.each(handler.attribute.get('options'), function(option){
      if(option.default) {
        defaultValue.push(option.value);
      }
    });
    
    handler.entity.setField(handler.fieldCode, defaultValue);
  }

  exists(option) {
    var handler = this;
    
    var value = handler.entity.getField(handler.fieldCode);
    if( ! _.isArray(value) ) {
      handler.entity.setField(handler.fieldCode, []);
    }
    
    return _.indexOf(value, option.value) != -1;
  }

  toggle(option) {
    var handler = this;
    var value = handler.entity.getField(handler.fieldCode);
    var index = _.indexOf(value, option.value);
    if(index != -1) {
      handler.remove(option);
      return;
    }
    handler.add(option);
  }

  remove(option) {
    var handler = this;
    var value = handler.entity.getField(handler.fieldCode);
    var index = _.indexOf(value, option.value);
    if(index != -1) {
      value.splice(index, 1);
    }
    handler.entity.setField(handler.fieldCode, value);
  }

  add(option) {
    var handler = this;
    var value = handler.entity.getField(handler.fieldCode);
    value.push(option.value);
    handler.entity.setField(handler.fieldCode, value);
  }
}

CheckboxHandlerController.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];