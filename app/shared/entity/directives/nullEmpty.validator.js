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
export default function NullEmptyValidator($q, $parse){

  return {
    restrict: 'A',
    require: ['nullEmpty', '?ngModel'],
    compile: compile,
    controller: ctrl
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

  function ctrl($scope, $attrs) {
    // this.modelGet = $parse($attrs.entityFieldUnique);
    this.isRequired = $parse($attrs.nullEmpty);
  }

  ctrl.$inject = [
    '$scope',
    '$attrs'
  ];
}

NullEmptyValidator.$inject = [
  '$q',
  '$parse'
];
