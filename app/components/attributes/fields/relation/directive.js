/**
 * @ngdoc directive
 * @name relationFieldEditor
 * @module app.components.attributes.relationField
 *
 * @restrict E
 *
 * @description
 * `<relation-field-editor>`.
 *
 * @usage
 *
 */

import template from './tmpl.html';

/**
 * ngInject
 */
export default function RelationFieldEditorDirective(){
  return {
    restrict: 'EA',
    require: ['relationFieldEditor'],
    template: template,
    scope: false,
    controller: 'RelationFieldEditorController',
    controllerAs: 'fieldCtrl',
    link: function(scope, element, attrs, ctrls) {
        var attrEditorCtrl = ctrls[0];
        var ctrl = ctrls[1];
    }
  };
}

RelationFieldEditorDirective.$inject = [];
