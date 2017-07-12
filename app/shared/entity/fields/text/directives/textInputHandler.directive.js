/**
 * @ngdoc directive
 * @name textInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<text-input-handler></text-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/textInputHandler.tmpl.html';
export default TextInputHandler;

/**
 * ngInject
 */
function TextInputHandler(){
  return {
    restrict: 'E',
    require: ['textInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'TextInputHandlerController',
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

TextInputHandler.$inject = [];