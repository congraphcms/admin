/**
 * @ngdoc directive
 * @name nullEmpty
 * @module app.shared.entity
 *
 * @restrict A
 *
 * @description
 * `<input null-empty />`.
 *
 * @usage
 *
 */


/**
 * ngInject
 */
class Ctrl {
  constructor($scope, $attrs, $parse) {
    this.isRequired = $parse($attrs.nullEmpty);
  }
}

Ctrl.$inject = [
  '$scope',
  '$attrs',
  '$parse'
];
export default function NullEmptyValidator($q, $parse){

  return {
    restrict: 'A',
    require: ['nullEmpty', '?ngModel'],
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
    if (ngModelCtrl && ngModelCtrl.$validators) {

      ngModelCtrl.$validators.empty = function(modelValue) {

        if(!ctrl.isRequired(scope) || modelValue !== null) {
          return true;
        }
        return false;
      }
    }
  }

}

NullEmptyValidator.$inject = [
  '$q',
  '$parse'
];
