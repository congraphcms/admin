/**
 * @ngdoc directive
 * @name tagInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<tag-input-handler></tag-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/tagInputHandler.tmpl.html';
export default TagInputHandler;

/**
 * ngInject
 */
function TagInputHandler(){
  return {
    restrict: 'E',
    require: ['tagInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'TagInputHandlerController',
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

TagInputHandler.$inject = [];