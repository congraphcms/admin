/**
 * @ngdoc directive
 * @name appSearch
 * @module app.shared.appSearch
 *
 * @restrict E
 *
 * @description
 * `<app-search>`.
 *
 * @usage
 *
 */

import template from './../views/appSearch.tmpl.html';
/**
 * ngInject
 */
export default function AppSearchDirective($state){
  return {
    restrict: 'E',
    template: template,
    controller: 'AppSearchController',
    controllerAs: 'searchCtrl',
    bindToController: true, //required in 1.3+ with controllerAs
  };
}

AppSearchDirective.$inject = ['$state'];