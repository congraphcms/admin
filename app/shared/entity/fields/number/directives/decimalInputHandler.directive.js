/**
 * @ngdoc directive
 * @name decimalInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<decimal-input-handler></decimal-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/decimalInputHandler.tmpl.html';
export default DecimalInputHandler;

/**
 * ngInject
 */
function DecimalInputHandler(){
  return {
    restrict: 'E',
    require: ['decimalInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'DecimalInputHandlerController',
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

DecimalInputHandler.$inject = [];