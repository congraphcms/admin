/**
 * @ngdoc directive
 * @name selectFieldEditor
 * @module app.components.attributes.selectField
 *
 * @restrict E
 *
 * @description
 * `<select-field-editor>`.
 *
 * @usage
 *
 */

import template from './tmpl.html';

/**
 * ngInject
 */
export default function SelectFieldEditorDirective(){
  return {
    restrict: 'EA',
    require: ['selectFieldEditor'],
    template: template,
    scope: false,
    controller: 'SelectFieldEditorController',
    controllerAs: 'fieldCtrl',
    link: function(scope, element, attrs, ctrls) {
        var attrEditorCtrl = ctrls[0];
        var ctrl = ctrls[1];
        
    }
  };
}

SelectFieldEditorDirective.$inject = [];