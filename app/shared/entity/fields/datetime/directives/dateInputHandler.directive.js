/**
 * @ngdoc directive
 * @name dateInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<date-input-handler></date-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/dateInputHandler.tmpl.html';
export default DateInputHandler;

/**
 * ngInject
 */
function DateInputHandler(){
  return {
    restrict: 'E',
    require: ['dateInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'DateInputHandlerController',
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

DateInputHandler.$inject = [];