/**
 * @ngdoc directive
 * @name attributeEditor
 * @module app.components.attributes
 *
 * @restrict E
 *
 * @description
 * `<attribute-editor>`.
 *
 * @usage
 *
 */

import template from './../views/attributeEditor.tmpl.html';

/**
 * ngInject
 */
export default function AttributeEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      attributeModel: "="
    },
    controller: 'AttributeEditorController',
    controllerAs: 'editor',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    // var attribtueEditorCtrl = _.isArray(ctrls) ? ctrls[0] : ctrls;
    // attribtueEditorCtrl.init();

    // scope.$on('$destroy', function() {
    //   attribtueEditorCtrl
    //     .destroy()
    //     .finally(function(){
    //       menuContainer.remove();
    //     });
    // });
  }
}

AttributeEditorDirective.$inject = [];
