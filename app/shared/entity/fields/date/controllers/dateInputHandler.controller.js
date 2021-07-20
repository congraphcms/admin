
import _ from 'underscore';

export default class DateInputHandlerController{

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

    // if(handler.entity.isNew()) {
    //   handler.setDefaultValue();
    // }

    var date = handler.entity.getField(handler.fieldCode);

    // if(date) {
    //   date = new Date(date);
    //   handler.entity.setField(handler.fieldCode, date);
    // }
    
    handler.$scope.$watch('handler.entity.attributes.fields.' + handler.fieldCode, function(value) {
      // if( ! value instanceof Date ) {
      //   value = new Date(value);
      // }
      if ( value instanceof Date ) {
        value = value.toISOString().split('T')[0];
      }

      handler.entity.setField(handler.fieldCode, value);

    });

  }
}

DateInputHandlerController.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];