/**
 * @ngdoc directive
 * @name cbOnEnter
 * @module app.components.entity
 *
 * @restrict A
 */

export default cbOnEnter;

/**
 * ngInject
 */
function cbOnEnter(){
  return {
    restrict: 'A',
    // require: 'ngModel',
    compile: compile
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ngModelCtrl) {
    element.bind("keydown keypress", function (event) {
        if(event.which === 13) {
            scope.$apply(function (){
                scope.$eval(attrs.cbOnEnter);
            });

            event.preventDefault();
        }
    });
  }
}

cbOnEnter.$inject = [];