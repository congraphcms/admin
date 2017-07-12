
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class TextFieldEditorController {
  constructor(
    $scope, 
    $element, 
    $attrs
  ) {
    /* jshint validthis: true */
    var vm = this;
    
    vm.$scope = $scope;
    vm.$element = $element;
    vm.$attrs = $attrs;

    vm.init();
  }

  init() {
    var ctrl = this;

  }

  isNew() {
    return this.attributeModel.isNew();
  }
}

TextFieldEditorController.$inject = [
  '$scope',
  '$element',
  '$attrs'
];