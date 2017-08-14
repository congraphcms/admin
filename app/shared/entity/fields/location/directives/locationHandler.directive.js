/**
 * @ngdoc directive
 * @name locationHandler
 * @module app.shared.entity.location
 *
 * @restrict E
 *
 * @description
 * `<location-handler></location-handler>`.
 *
 * @usage
 *
 */
import template from './../views/locationHandler.tmpl.html';
export default LocationHandler;

/**
 * ngInject
 */
function LocationHandler(){
  return {
    restrict: 'E',
    require: ['locationHandler', '^^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "=",
      locale: "="
    },
    controller: 'LocationHandlerController',
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

LocationHandler.$inject = [];