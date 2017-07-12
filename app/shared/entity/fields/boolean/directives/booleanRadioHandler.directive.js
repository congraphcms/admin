/**
 * @ngdoc directive
 * @name booleanRadioHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<boolean-radio-handler></boolean-radio-handler>`.
 *
 * @usage
 *
 */
import template from './../views/booleanRadioHandler.tmpl.html';
export default BooleanRadioHandler;

/**
 * ngInject
 */
function BooleanRadioHandler(){
  return {
    restrict: 'E',
    require: ['booleanRadioHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'BooleanRadioHandlerController',
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

BooleanRadioHandler.$inject = [];