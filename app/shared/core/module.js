/**
 * @ngdoc module
 * @name app.shared.core
 * @description
 *
 * App Core
 */

require("./styles/utilities.scss");
require("./styles/loader.scss");
require("./styles/sidenav.scss");
require("./styles/listing.scss");
require("./styles/theme.scss");
require("./styles/forms.scss");
require("./styles/table.scss");
require("./styles/animations.scss");
require("angular-material/angular-material.min.css");
require("./styles/ng-sortable.scss");


import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import CoreRouterConfig from './router.js';

import AppController from './controllers/app.controller.js';
import EditorRegistry from './services/editorRegistry.service.js';

import ModelsModule from './../models/module.js';
import HelpersModule from './../helpers/module.js';
import AppHeaderModule from './../appHeader/module.js';
import AppSidenavModule from './../appSidenav/module.js';
import EntityModule from './../entity/module.js';
// import MediaLibraryModule from './../mediaLibrary/module.js';

// import casesComponent from './../../components/cases/module.js';
// import contactsComponent from './../../components/contacts/module.js';


export default 'app.shared.core';

angular
  .module('app.shared.core', [
    uiRouter,
    ngMaterial,

    ModelsModule,
    HelpersModule,
    AppHeaderModule,
    AppSidenavModule,
    EntityModule
    // casesComponent,
    // contactsComponent,
    // MediaLibraryModule
    // 'angularMoment',
    // 'app.shared.helpers',
    // 'app.shared.appSearch',
    // 'app.shared.appSidenav',
    // 'app.shared.mediaLibrary',
    // 'app.components.dashboard',
    // 'app.components.status',
    // 'app.components.entity',
    // 'app.components.contentModel',
    // 'app.components.attribute',
    // 'app.components.locale',
    // 'app.components.user',
    // 'app.components.login'
  ])
  .controller('AppController', AppController)
  .factory('EditorRegistry', EditorRegistry)
  .config(CoreRouterConfig);
