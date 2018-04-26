import './global.scss';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import ngSortable from 'ng-sortable';

import SettingsFactory from './app.settings.js';
import routerConfig from './app.router.js';
import { mdThemesConfig, translationsConfig, authConfig } from './app.config.js';

import coreModule from './shared/core/module.js';
import oauthModule from './shared/oauth/module.js';
import cbOAuthSettings from './shared/oauth/settings.js';

import dashboardComponent from './components/dashboard/module.js';
import loginComponent from './components/login/module.js';
import entitiesComponent from './components/entities/module.js';
import attributesComponent from './components/attributes/module.js';
import contentModelsComponent from './components/contentModels/module.js';
import localesComponent from './components/locales/module.js';
import usersComponent from './components/users/module.js';
import mediaComponent from './components/media/module.js';

/**
 * @ngdoc module
 * @name app
 * @description
 *
 * App
 */
export default angular
  .module('app', [
    uiRouter,
    ngAnimate,
    ngSortable,
    coreModule,
    oauthModule,
    dashboardComponent,
    loginComponent,
    entitiesComponent,
    attributesComponent,
    contentModelsComponent,
    localesComponent,
    usersComponent,
    mediaComponent
  ])
  .factory('AppSettings', SettingsFactory)
  .config(routerConfig)
  .config(cbOAuthSettings)

  .config(mdThemesConfig)

  // translations
  .run(translationsConfig)

  // authentication
  .run(authConfig);
