/**
 * @ngdoc directive
 * @name entityEditor
 * @module app.components.entity
 *
 * @restrict A
 *
 * @description
 * `<form entity-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/entityEditor.tmpl.html';

/**
 * ngInject
 */
export default function EntityEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "=",
      attributeSet: "=",
      attributes: "=",
      contentModel: "=",
      locales: "=",
      locale: "="
    },
    controller: 'EntityEditorController',
    controllerAs: 'editor',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {

    return link;
  }

  function link(scope, element, attrs, ctrls) {
    console.log('EntityEditorDirective', scope);
  }
}

EntityEditorDirective.$inject = [];