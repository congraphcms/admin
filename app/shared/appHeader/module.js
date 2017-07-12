/**
 * @ngdoc module
 * @name app.shared.appHeader
 * @description
 *
 * App Header
 */

require("./styles/header.scss");

import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import oauthModule from './../oauth/module.js';
import appSearchModule from './../appSearch/module.js';

import AppHeaderController from './controllers/appHeader.controller.js';
import AppHeaderDirective from './directives/appHeader.directive.js';

export default 'app.shared.appHeader';

angular
  .module('app.shared.appHeader', [
    uiRouter,
    ngMaterial,
    oauthModule,
    appSearchModule
    // 'app.shared.appSidenav'
  ])
  .controller('AppHeaderController', AppHeaderController)
  .directive('appHeader', AppHeaderDirective);