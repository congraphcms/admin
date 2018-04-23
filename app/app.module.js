import './global.scss';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import ngSortable from 'ng-sortable';

import SettingsFactory from './app.settings.js';
import routerConfig from './app.router.js';
import translations from './translations.js';

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

  .config(['$mdThemingProvider', function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('cb-dark')
      .primaryPalette('grey', {'default': '800'})
      .accentPalette('grey', {'default': '700'})
      .dark();

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('cb-grey', 'default')
      .backgroundPalette('grey', {'default': '200'});


  }])

  // translations
  .run(['$rootScope', function($rootScope){
    $rootScope.translations = translations;
    $rootScope.language = 'sr';
    $rootScope.translate = function(key) {
      return $rootScope.translations[$rootScope.language][key] || key;
    };

    angular.element(document.getElementById('loader-text')).html($rootScope.translate('please_wait_text'));
  }])

  // authentication
  .run(['$rootScope', '$state', '$stateParams', 'cbOAuth', function($rootScope, $state, $stateParams, cbOAuth) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
      // track the state the user wants to go to;
      // authorization service needs this
      $rootScope.toState = toState;
      $rootScope.toStateParams = toStateParams;

      // if the principal is resolved, do an
      // authorization check immediately. otherwise,
      // it'll be done when the state it resolved.


      if (toState.requireAuth && !cbOAuth.isAuthenticated()) {
        event.preventDefault();
        console.warn('Not Authorized', cbOAuth.isAuthenticated());
        $state.go('login', {redirect: toState, redirectParams: toStateParams}, {reload: true});
        return;
      }

      if(toState.name == 'login' && cbOAuth.isAuthenticated()){
        console.warn('Already authenticated');
        event.preventDefault();
        $state.go('app.dashboard');
        return;
      }

      if(!cbOAuth.ownerExists() && cbOAuth.isAuthenticated()) {
        cbOAuth.getOwner();
      }

    });

    $rootScope.$on('oauth:error', function(event, errors) {
      console.error('oauth:error handler', errors);
      $state.go('login', {reload: true});
    });
  }]);
