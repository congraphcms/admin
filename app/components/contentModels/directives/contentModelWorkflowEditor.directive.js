/**
 * @ngdoc directive
 * @name contentModelWorkflowEditor
 * @module app.components.contentModel
 *
 * @restrict E
 *
 * @description
 * `<form content-model-workflow-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/contentModelWorkflowEditor.tmpl.html';

/**
 * ngInject
 */
export default function ContentModelWorkflowEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "="
    },
    controller: 'ContentModelWorkflowEditorController',
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

ContentModelWorkflowEditorDirective.$inject = [];