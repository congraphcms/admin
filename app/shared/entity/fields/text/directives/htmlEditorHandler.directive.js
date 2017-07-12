/**
 * @ngdoc directive
 * @name htmlEditorHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<html-editor-handler></html-editor-handler>`.
 *
 * @usage
 *
 */
import template from './../views/htmlEditorHandler.tmpl.html';
export default HtmlEditorHandler;

/**
 * ngInject
 */
function HtmlEditorHandler(){
  return {
    restrict: 'E',
    require: ['htmlEditorHandler', '^^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'HtmlEditorHandlerController',
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

HtmlEditorHandler.$inject = [];