/**
 * @ngdoc module
 * @name app.shared.oauth
 * @description
 *
 * OAuth services
 */

import ngCookies from 'angular-cookies';
import angularMoment from 'angular-moment';
import oauthConfig from './config.js';
import cbOAuthProvider from './service.js';
import {cbOAuthRejectExpiredToken, cbOAuthRefreshExpiredToken} from './httpInterceptor.js';

export default 'app.shared.oauth';

angular
  .module('app.shared.oauth', [
    ngCookies,
    angularMoment
  ])
  .provider('cbOAuth', cbOAuthProvider)
  .factory('cbOAuthRejectExpiredToken', cbOAuthRejectExpiredToken)
  .factory('cbOAuthRefreshExpiredToken', cbOAuthRefreshExpiredToken)
  .config(oauthConfig);