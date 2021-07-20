/**
 * @ngdoc directive
 * @name DatetimeInputHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<datetime-input-handler></datetime-input-handler>`.
 *
 * @usage
 *
 */
import template from './../views/datetimeInputHandler.tmpl.html';
export default DatetimeInputHandler;

/**
 * ngInject
 */
function DatetimeInputHandler(){
  return {
    restrict: 'E',
    require: ['datetimeInputHandler', '^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "="
    },
    controller: 'DatetimeInputHandlerController',
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

DatetimeInputHandler.$inject = [];