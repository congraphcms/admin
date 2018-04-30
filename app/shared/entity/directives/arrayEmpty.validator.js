/**
 * @ngdoc directive
 * @name arrayEmpty
 * @module app.shared.entity
 *
 * @restrict A
 *
 * @description
 * `<input array-empty />`.
 *
 * @usage
 *
 */
import _ from 'underscore';

/**
 * ngInject
 */
class Ctrl {
  constructor($scope, $attrs, $parse) {
    // this.modelGet = $parse($attrs.entityFieldUnique);
    this.isRequired = $parse($attrs.arrayEmpty);
    this.getAttribute = $parse($attrs.arrayEmpty);
  }
}

Ctrl.$inject = [
  '$scope',
  '$attrs',
  '$parse'
];
export default function ArrayEmptyValidator($q, $parse){

  return {
    restrict: 'A',
    require: ['arrayEmpty', '?ngModel'],
    compile: compile,
    controller: Ctrl
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    // only apply the validator if ngModel is present

    var ctrl = ctrls[0];
    var ngModelCtrl = ctrls[1];
    
    scope.$watch(function () { return ngModelCtrl.$modelValue && ngModelCtrl.$modelValue.length; }, function() {
      ngModelCtrl.$validate(); // validate again when array changes
    });

    if (ngModelCtrl && ngModelCtrl.$validators) {

      ngModelCtrl.$validators.empty = function(modelValue) {
        var attribute = ctrl.getAttribute(scope);

        if(_.isArray(modelValue) && modelValue.length > 0) {
          return true;
        }

        if(_.isObject(attribute) && !attribute.get('required')) {
          return true;
        }
        
        return false;
      }
    }
  }

}

ArrayEmptyValidator.$inject = [
  '$q',
  '$parse'
];
