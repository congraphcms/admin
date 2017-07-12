/**
 * @ngdoc directive
 * @name appHeader
 * @module app.shared.appHeader
 *
 * @restrict E
 *
 * @description
 * `<app-header>`.
 *
 * @usage
 *
 */

import template from './../views/appHeader.tmpl.html';

export default function AppHeaderDirective($state){
  return {
    restrict: 'E',
    template: template,
    scope: {},
    controller: 'AppHeaderController',
    controllerAs: 'ctrl',
    bindToController: true
  };
}

AppHeaderDirective.$inject = ['$state'];