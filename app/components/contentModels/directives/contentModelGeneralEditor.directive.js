/**
 * @ngdoc directive
 * @name contentModelGeneralEditor
 * @module app.components.contentModel
 *
 * @restrict E
 *
 * @description
 * `<form content-model-general-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/contentModelGeneralEditor.tmpl.html';

/**
 * ngInject
 */
export default function ContentModelGeneralEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "="
    },
    controller: 'ContentModelGeneralEditorController',
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

ContentModelGeneralEditorDirective.$inject = [];