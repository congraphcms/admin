/**
 * @ngdoc directive
 * @name contactQuickForm
 * @module app.components.contacts
 *
 * @restrict EA
 *
 * @description
 * `<contact-quick-form></contact-quick-form>`.
 *
 * @usage
 *
 */

import template from './../views/entityQuickForm.tmpl.html';

/**
 * ngInject
 */
export default function EntityQuickFormDirective($timeout){
  return {
    restrict: 'AE',
    // require: 'form',
    template: template,
    scope: {
      model: "=",
      attributeSet: "=",
      contentModel: "=",
      instance: "="
      // locales: "=",
      // locale: "="
    },
    controller: 'EntityQuickFormController',
    controllerAs: 'qf',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    return {
      pre: preLink,
      post: postLink
    }
  }

  function preLink(element, attrs) {

  }

  function postLink(scope, element, attrs, ctrl) {

  }
}

EntityQuickFormDirective.$inject = [
  '$timeout'
];