/**
 * @ngdoc directive
 * @name relationSearchHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<relation-search-handler></relation-search-handler>`.
 *
 * @usage
 *
 */
import template from './../views/relationSearchHandler.tmpl.html';
export default RelationSearchHandler;

/**
 * ngInject
 */
function RelationSearchHandler(){
  return {
    restrict: 'E',
    require: ['relationSearchHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "=",
      locale: "=",
      locales: "="
    },
    controller: 'RelationSearchHandlerController',
    controllerAs: 'handler',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    scope.form = ctrls[1];
    ctrls[0].form = scope.form;
  }
}

RelationSearchHandler.$inject = [];