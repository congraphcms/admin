/**
 * @ngdoc directive
 * @name radioInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<radio-input-handler></radio-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/radioInputHandler.tmpl.html';
export default RadioInputHandler;

/**
 * ngInject
 */
function RadioInputHandler(){
  return {
    restrict: 'E',
    require: ['radioInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'RadioInputHandlerController',
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

RadioInputHandler.$inject = [];