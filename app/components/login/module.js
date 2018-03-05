/**
 * @ngdoc module
 * @name app.components.login
 * @description
 *
 * Login
 */


import "./styles/login.scss";

import ngMaterial from 'angular-material';
import helpersModule from './../../shared/helpers/module.js';
import oauthModule from './../../shared/oauth/module.js';
import LoginRouterConfig from './router.js';
import LoginController from './controllers/login.controller.js';

export default 'app.components.login';

angular
  .module('app.components.login', [
    ngMaterial,
    helpersModule,
    oauthModule
  ])
  .controller('LoginController', LoginController)
  .config(LoginRouterConfig);