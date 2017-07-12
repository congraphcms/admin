/**
 * @ngdoc module
 * @name app.shared.appSearch
 * @description
 *
 * App Search
 */

import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import ModelsModule from './../models/module.js';

import AppSearchController from './controllers/appSearch.controller.js';
import AppSearchDirective from './directives/appSearch.directive.js';

export default 'app.shared.appSearch';

angular
  .module('app.shared.appSearch', [
    uiRouter,
    ngMaterial,
    ModelsModule
  ])
  .controller('AppSearchController', AppSearchController)
  .directive('appSearch', AppSearchDirective);