/**
 * @ngdoc directive
 * @name appSidenav
 * @module app.shared.appSidenav
 *
 * @restrict E
 *
 * @description
 * `<app-sidenav>`.
 *
 * @usage
 *
 */

import template from './../views/appSidenav.tmpl.html';

export default AppSidenavDirective;

function AppSidenavDirective(){
  return {
    restrict: 'E',
    template: template,
    scope: {
      locales: '='
    },
    controller: 'AppSidenavController',
    controllerAs: 'ctrl',
    bindToController: true,
    compile: function(element) {
      return postLink;
    }
  };

  /**
   * Directive Post Link function...
   */
  function postLink(scope, element, attr, sidenavCtrl) {
    // var sidenavCtrl = ctrls[0];
    sidenavCtrl.init();
  }
  
}

AppSidenavDirective.$inject = [];