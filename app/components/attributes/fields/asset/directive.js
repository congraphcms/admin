/**
 * @ngdoc directive
 * @name assetFieldEditor
 * @module app.components.attributes.assetField
 *
 * @restrict E
 *
 * @description
 * `<asset-field-editor>`.
 *
 * @usage
 *
 */

import template from './tmpl.html';

/**
 * ngInject
 */
export default function AssetFieldEditorDirective(){
  return {
    restrict: 'EA',
    require: ['assetFieldEditor'],
    template: template,
    scope: false,
    controller: 'AssetFieldEditorController',
    controllerAs: 'fieldCtrl',
    link: function(scope, element, attrs, ctrls) {
        var attrEditorCtrl = ctrls[0];
        var ctrl = ctrls[1];
    }
  };
}

AssetFieldEditorDirective.$inject = [];
