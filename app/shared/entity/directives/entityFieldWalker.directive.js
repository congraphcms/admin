/**
 * @ngdoc directive
 * @name entityFieldWalker
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<entity-field-walker></entity-field-walker>`.
 *
 * @usage
 *
 */

import template from './../views/entityFieldWalker.tmpl.html';
export default EntityFieldWalker;

/**
 * ngInject
 */
function EntityFieldWalker(){
  return {
    restrict: 'E',
    template: template,
    scope: {
      entity: "=",
      attributeSet: "=",
      contentModel: "=",
      form: "=",
      locale: "=",
      locales: "="
    },
    controller: 'EntityFieldWalkerController',
    controllerAs: 'walker',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    
  }
}

EntityFieldWalker.$inject = [];