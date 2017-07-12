/**
 * @ngdoc directive
 * @name mediaLibraryHandler
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<media-library-handler></media-library-handler>`.
 *
 * @usage
 *
 */
import template from './../views/mediaLibraryHandler.tmpl.html';
export default MediaLibraryHandler;

/**
 * ngInject
 */
function MediaLibraryHandler(){
  return {
    restrict: 'E',
    require: ['mediaLibraryHandler', '^^form'],
    template: template,
    scope: {
      entity: "=",
      attribute: "=",
      locale: "="
    },
    controller: 'MediaLibraryHandlerController',
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

MediaLibraryHandler.$inject = [];