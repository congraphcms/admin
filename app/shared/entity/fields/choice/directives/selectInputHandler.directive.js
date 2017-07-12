/**
 * @ngdoc directive
 * @name selectInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<select-input-handler></select-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/selectInputHandler.tmpl.html';
export default SelectInputHandler;

/**
 * ngInject
 */
function SelectInputHandler(){
  return {
    restrict: 'E',
    require: ['selectInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'SelectInputHandlerController',
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

SelectInputHandler.$inject = [];