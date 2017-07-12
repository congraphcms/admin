/**
 * @ngdoc directive
 * @name userPasswordEditor
 * @module app.components.users
 *
 * @restrict E
 *
 * @description
 * `<form user-change-password-editor></form>`.
 *
 * @usage
 *
 */

import template from './../views/userPasswordEditor.tmpl.html';

/**
 * ngInject
 */
export default function UserPasswordEditorDirective(){
  return {
    restrict: 'A',
    require: 'form',
    template: template,
    scope: {
      model: "="
    },
    controller: 'UserPasswordEditorController',
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

UserPasswordEditorDirective.$inject = [];
