/**
 * @ngdoc directive
 * @name cbDatepicker
 * @module app.components.entity
 *
 * @restrict A
 */

export default cbDatepicker;

/**
 * ngInject
 */
function cbDatepicker($q, $parse){
  return {
    restrict: 'A',
    require: 'ngModel',
    compile: compile
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ngModelCtrl) {

  }
}

cbDatepicker.$inject = [
  '$q',
  '$parse'
];