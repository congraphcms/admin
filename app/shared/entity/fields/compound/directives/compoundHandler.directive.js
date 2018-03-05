/**
 * @ngdoc directive
 * @name compoundHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<compound-handler></compound-handler>`.
 *
 * @usage
 *
 */
import template from './../views/compoundHandler.tmpl.html';
export default CompoundHandler;

/**
 * ngInject
 */
function CompoundHandler(){
  return {
    restrict: 'E',
    require: ['compoundHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'CompoundHandlerController',
    controllerAs: 'handler',
    // bindToController: true,
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

CompoundHandler.$inject = [];