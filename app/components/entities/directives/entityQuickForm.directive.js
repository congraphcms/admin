/**
 * @ngdoc directive
 * @name entityQuickForm
 * @module app.components.entities
 *
 * @restrict EA
 *
 * @description
 * `<entity-quick-form></entity-quick-form>`.
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
      attributes: "=",
      contentModel: "=",
      instance: "=",
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