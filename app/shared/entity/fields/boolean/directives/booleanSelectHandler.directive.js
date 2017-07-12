/**
 * @ngdoc directive
 * @name booleanSelectHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<boolean-select-handler></boolean-select-handler>`.
 *
 * @usage
 *
 */
import template from './../views/booleanSelectHandler.tmpl.html';
export default BooleanSelectHandler;

/**
 * ngInject
 */
function BooleanSelectHandler(){
  return {
    restrict: 'E',
    require: ['booleanSelectHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'BooleanSelectHandlerController',
    controllerAs: 'handler',
    // bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    scope.form = ctrls[1];
    ctrls[0].form = scope.form;
  }
}

BooleanSelectHandler.$inject = [];