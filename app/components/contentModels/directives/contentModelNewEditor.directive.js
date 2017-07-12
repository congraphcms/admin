/**
 * @ngdoc directive
 * @name contentModelNewEditor
 * @module app.components.contentModel
 *
 * @restrict E
 *
 * @description
 * `<form content-model-new-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/contentModelNewEditor.tmpl.html';

/**
 * ngInject
 */
export default function ContentModelNewEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "="
    },
    controller: 'ContentModelNewEditorController',
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

ContentModelNewEditorDirective.$inject = [];