/**
 * @ngdoc directive
 * @name userEditor
 * @module app.components.users
 *
 * @restrict E
 *
 * @description
 * `<form user-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/userEditor.tmpl.html';

/**
 * ngInject
 */
export default function UserEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "=",
      roles: "="
    },
    controller: 'UserEditorController',
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

UserEditorDirective.$inject = [];
