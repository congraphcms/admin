/**
 * @ngdoc module
 * @name app.shared.appSidenav
 * @description
 *
 * App Sidenav
 */

import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import ModelsModule from './../models/module.js';

import AppSidenavService from './services/appSidenav.service.js';
import AppSidenavController from './controllers/appSidenav.controller.js';
import AppSidenavDirective from './directives/appSidenav.directive.js';

export default 'app.shared.appSidenav';

angular
  .module('app.shared.appSidenav', [
    uiRouter,
    ngMaterial,
    ModelsModule
  ])
  .factory('appSidenavService', AppSidenavService)
  .controller('AppSidenavController', AppSidenavController)
  .directive('appSidenav', AppSidenavDirective);