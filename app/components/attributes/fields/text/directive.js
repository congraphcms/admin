/**
 * @ngdoc directive
 * @name textFieldEditor
 * @module app.components.attributes.textField
 *
 * @restrict E
 *
 * @description
 * `<text-field-editor>`.
 *
 * @usage
 *
 */

import template from './tmpl.html';

/**
 * ngInject
 */
export default function TextFieldEditorDirective(){
  return {
    restrict: 'EA',
    // require: ['cbFieldEditor'],
    template: template,
    scope: false,
    controller: 'TextFieldEditorController',
    controllerAs: 'fieldCtrl',
    bindToController: true,
    compile: function(element) {

    },
    link: function() {

    }
  };
}

TextFieldEditorDirective.$inject = [];