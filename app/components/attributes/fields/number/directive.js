/**
 * @ngdoc directive
 * @name numberFieldEditor
 * @module app.components.attributes.numberField
 *
 * @restrict E
 *
 * @description
 * `<number-field-editor>`.
 *
 * @usage
 *
 */

import template from './tmpl.html';

/**
 * ngInject
 */
export default function NumberFieldEditorDirective(){
  return {
    restrict: 'EA',
    // require: ['cbFieldEditor'],
    template: template,
    scope: false,
    controller: 'NumberFieldEditorController',
    controllerAs: 'fieldCtrl',
    bindToController: true,
    compile: function(element) {

    }
  };
}

NumberFieldEditorDirective.$inject = [];