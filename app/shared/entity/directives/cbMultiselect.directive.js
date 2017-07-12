/**
 * @ngdoc directive
 * @name cbMultiselect
 * @module app.components.entity
 *
 * @restrict EA
 */

import _ from 'underscore';

export default cbMultiselect;

/**
 * ngInject
 */
function cbMultiselect($q, $parse){
  return {
    restrict: 'EA',
    require: 'ngModel',
    compile: compile
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ngModelCtrl) {

    ngModelCtrl.$options = {allowInvalid: true};
    ngModelCtrl.$validators.required = isEmpty;
    function isEmpty(modelValue, viewValue) {
      if(!scope.$eval(attrs.ngRequired)) {
        return true;
      }
      var value = modelValue || viewValue;
      if(!value || value == null || value == ''){
        return false;
      }
      if(_.isArray(value) || _.isObject(value)){
        if (value.length == 0) {
          return false;
        }
      }
      return true;
    }
    // // ngModelCtrl.$isEmpty = isEmpty;

    scope.ngModelCtrl = ngModelCtrl;

    // // scope.$watchCollection('myValue', validateModel);
    scope.$watchCollection('ngModelCtrl.$modelValue.models', validateModel);

    function validateModel() {
      ngModelCtrl.$validate();
    }
  }
}

cbMultiselect.$inject = [
  '$q',
  '$parse'
];