/**
 * @ngdoc directive
 * @name localeEditor
 * @module app.components.locales
 *
 * @restrict E
 *
 * @description
 * `<locale-editor>`.
 *
 * @usage
 *
 */

import template from './../views/localeEditor.tmpl.html';

/**
 * ngInject
 */
export default function LocaleEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "="
    },
    controller: 'LocaleEditorController',
    controllerAs: 'editor',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    return link;
  }

  function link(scope, element, attrs, ctrls) {

  }
}

LocaleEditorDirective.$inject = [];
