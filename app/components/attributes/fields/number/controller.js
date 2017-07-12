
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class NumberFieldEditorController {
  constructor(
    $scope, 
    $element, 
    $attrs
  ) {
    /* jshint validthis: true */
    let vm = this;
    
    vm.$scope = $scope;
    vm.$element = $element;
    vm.$attrs = $attrs;

    vm.init();
  }

  init() {
    let ctrl = this;
  };

  isNew() {
    return this.attributeModel.isNew();
  };
}

NumberFieldEditorController.$inject = [
  '$scope',
  '$element',
  '$attrs'
];