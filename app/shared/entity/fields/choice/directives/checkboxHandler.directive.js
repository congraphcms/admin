/**
 * @ngdoc directive
 * @name checkboxHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<checkbox-handler></checkbox-handler>`.
 *
 * @usage
 *
 */
import template from './../views/checkboxHandler.tmpl.html';
export default CheckboxHandler;

/**
 * ngInject
 */
function CheckboxHandler(){
  return {
    restrict: 'E',
    require: ['checkboxHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'CheckboxHandlerController',
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

CheckboxHandler.$inject = [];