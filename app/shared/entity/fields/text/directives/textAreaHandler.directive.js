/**
 * @ngdoc directive
 * @name textAreaHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<text-area-handler></text-area-handler>`.
 *
 * @usage
 *
 */
import template from './../views/textAreaHandler.tmpl.html';
export default TextAreaHandler;

/**
 * ngInject
 */
function TextAreaHandler(){
  return {
    restrict: 'E',
    require: ['textAreaHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'TextAreaHandlerController',
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

TextAreaHandler.$inject = [];