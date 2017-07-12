/**
 * @ngdoc directive
 * @name attributeSetEditor
 * @module app.components.contentModel
 *
 * @restrict E
 *
 * @description
 * `<form attribute-set-general-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/attributeSetEditor.tmpl.html';

/**
 * ngInject
 */
export default function AttributeSetEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "=",
      attributes: "=",
      contentModel: "="
    },
    controller: 'AttributeSetEditorController',
    controllerAs: 'editor',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    
  }
}

AttributeSetEditorDirective.$inject = [];