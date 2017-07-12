/**
 * @ngdoc directive
 * @name integerInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<integer-input-handler></integer-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/integerInputHandler.tmpl.html';
export default IntegerInputHandler;

/**
 * ngInject
 */
function IntegerInputHandler(){
  return {
    restrict: 'E',
    require: ['integerInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'IntegerInputHandlerController',
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

IntegerInputHandler.$inject = [];