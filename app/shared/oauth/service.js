

import Qs from 'qs';

export default cbOAuthProvider;

var defaults = {
  clientId: null,
  clientSecret: null,
  grantPath: '/oauth/access_token',
  revokePath: '/oauth/revoke_token',
  ownerPath: '/oauth/owner',
  sessionName: 'cbToken',
  sessionOptions: {
    secure: false
  }
};

var requiredKeys = [
  'clientId',
  'grantPath',
  'revokePath'
];

/**
 * OAuth provider.
 */

function cbOAuthProvider() {
  var config;

  /**
   * Configure.
   *
   * @param {object} params - An `object` of params to extend.
   */

  this.configure = function(params) {
    // Can only be configured once.
    if (config) {
      throw new Error('Already configured.');
    }

    // Check if is an `object`.
    if (!(params instanceof Object)) {
      throw new TypeError('Invalid argument: `config` must be an `Object`.');
    }

    // Extend default configuration.
    config = angular.extend({}, defaults, params);

    // Check if all required keys are set.
    angular.forEach(requiredKeys, (key) => {
      if (!config[key]) {
        throw new Error('Missing parameter: '+key+'.');
      }
    });

    // Add `grantPath` facing slash.
    if('/' !== config.grantPath[0]) {
      config.grantPath = '/' + config.grantPath;
    }

    // Add `revokePath` facing slash.
    if('/' !== config.revokePath[0]) {
      config.revokePath = '/' + config.revokePath;
    }

    return config;
  };

  /**
   * OAuth service.
   */

  this.$get = function($injector, $cookies, $q, moment) {
    

    /**
     * Constructor
     */
    var OAuth = function() {
      if (!config) {
        throw new Error('`cbOAuthProvider` must be configured first.');
      }

      this.AppSettings = $injector.get('AppSettings');
      config.baseUrl = this.AppSettings.APP.CG_URL;
      // Remove `baseUrl` trailing slash.
      if('/' === config.baseUrl.substr(-1)) {
        config.baseUrl = config.baseUrl.slice(0, -1);
      }

      this.deferedUser = $q.defer();
      this.userPromise = this.deferedUser.promise;
    }

    /**
     * Verifies if the `user` is authenticated or not based on the `token`
     * cookie.
     *
     * @return {boolean}
     */
    OAuth.prototype.isAuthenticated = function() {
      return !!this.getToken();
    }

    /**
     * Retrieves the `access_token` and stores the `response.data` on cookies
     *
     * @param {object} data - Request content, e.g., `username` and `password`.
     * @param {object} options - Optional configuration.
     * @return {promise} A response promise.
     */
    OAuth.prototype.authenticate = function(data, options) {
      var self = this;
      // console.log('oauth config', config);
      data = angular.extend({
        client_id: config.clientId,
        grant_type: 'password'
      }, data);

      if (null !== config.clientSecret) {
        data.client_secret = config.clientSecret;
      }

      if (null !== config.scopes) {
        data.scope = config.scopes;
      }

      data = Qs.stringify(data);

      options = angular.extend({
        headers: {
          'Authorization': undefined,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, options);

      var $http = $injector.get('$http');

      return $http.post(config.baseUrl + config.grantPath, data, options).then( function(response) {
        var cookie = self.setToken(response.data);
        // console.log('cookie', cookie);
        // console.log('token', self.getToken());
        self.getOwner();
        return response;
      });
    }

    /**
     * Retrieves the `refresh_token` and stores the `response.data` on cookies
     *
     * @param {object} data - Request content.
     * @param {object} options - Optional configuration.
     * @return {promise} A response promise.
     */
    OAuth.prototype.refreshToken = function(data, options) {
      var self = this;

      data = angular.extend({
        client_id: config.clientId,
        grant_type: 'refresh_token',
        refresh_token: self.getRefreshToken(),
      }, data);

      if (null !== config.clientSecret) {
        data.client_secret = config.clientSecret;
      }

      data = Qs.stringify(data);

      options = angular.extend({
        headers: {
          'Authorization': undefined,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, options);

      var $http = $injector.get('$http');

      var promise = $http.post(config.baseUrl + config.grantPath, data, options).then(function(response){
        self.setToken(response.data);
        self.refreshingToken = false;
        return response;
      });

      self.refreshingTokenPromise = promise;

      self.refreshingToken = true;

      return promise;
    }

    /**
     * Revokes the `token` and removes the stored `token` from cookies
     *
     * @param {object} data - Request content.
     * @param {object} options - Optional configuration.
     * @return {promise} A response promise.
     */
    OAuth.prototype.revokeToken = function(data, options) {
      var self = this;

      var refreshToken = self.getRefreshToken();

      data = angular.extend({
        client_id: config.clientId,
        token: refreshToken ? refreshToken : self.getAccessToken(),
        token_type_hint: refreshToken ? 'refresh_token' : 'access_token'
      }, data);

      if (null !== config.clientSecret) {
        data.client_secret = config.clientSecret;
      }

      data = Qs.stringify(data);

      options = angular.extend({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, options);

      var $http = $injector.get('$http');

      return $http.post(config.baseUrl + config.revokePath, data, options).then(function(response){
        self.removeToken();

        return response;
      });
    }

    /**
     * Gets user based on access token
     *
     * @param {object} data - Request content.
     * @param {object} options - Optional configuration.
     * @return {promise} A response promise.
     */
    OAuth.prototype.getOwner = function(data, options) {
      var self = this;

      // var defered = $q.defer();

      data = Qs.stringify(data);

      var $http = $injector.get('$http');
      // console.log('http options', options);
      
      if(self.accessTokenExpired()) {
        var defered = $q.defer();
        self.refreshToken()
          .then(function(){

            options = angular.extend({
              headers: {
                'Authorization': self.getAuthorizationHeader(),
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }, options);

            var request = angular.extend({}, {
              method: 'GET',
              url: config.baseUrl + config.ownerPath,
              data: data
            }, options);

            $http(request).then(function(response){

              // console.log('get owner response', response);
              self.setUser(response);
              defered.resolve(response);
              return response;
            });
          })
          .catch(function(errors){
            defered.reject(errors);
            return errors;
          });
        return defered.promise;
      }

      options = angular.extend({
        headers: {
          'Authorization': self.getAuthorizationHeader(),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }, options);

      var request = angular.extend({}, {
        method: 'GET',
        url: config.baseUrl + config.ownerPath,
        data: data
      }, options);

      return $http(request).then(function(response){
        // console.log('get owner response', response);
        self.setUser(response);
        return response;
      });


      // self.userPromise = defered.promise;
      // return userPromise;
    }

    /**
     * Check if owner is set.
     */
    OAuth.prototype.ownerExists = function() {
      return !!self.user || !!self.userPromise;
    }

    /**
     * Set user.
     */
    OAuth.prototype.setUser = function(data) {
      var self = this;

      self.user = data.data.data;
      self.deferedUser.resolve(self.user);
    }

    /**
     * Get user.
     */
    OAuth.prototype.getUser = function(data) {
      var self = this;

      return self.userPromise;
    }

    /**
     * Set token.
     */
    OAuth.prototype.setToken = function(data) {
      if(data.expires_in) {
        data.expiration_date = moment().add(data.expires_in, 's').format();
      }
      return $cookies.putObject(config.sessionName, data, config.sessionOptions);
    }

    /**
     * Get token.
     */
    OAuth.prototype.getToken = function() {
      return $cookies.getObject(config.sessionName);
    }

    /**
     * Get accessToken.
     */
    OAuth.prototype.getAccessToken = function() {
      return this.getToken() ? this.getToken().access_token : undefined;
    }

    /**
     * Get authorizationHeader.
     */
    OAuth.prototype.getAuthorizationHeader = function() {
      // console.log('token type', this.getTokenType());
      // console.log('access token', this.getAccessToken());
      if (!(this.getTokenType() && this.getAccessToken())) {
        return;
      }

      return this.getTokenType().charAt(0).toUpperCase() + this.getTokenType().substr(1) + ' ' + this.getAccessToken();
    }

    /**
     * Get refreshToken.
     */
    OAuth.prototype.getRefreshToken = function() {
      return this.getToken() ? this.getToken().refresh_token : undefined;
    }

    /**
     * Get tokenType.
     */
    OAuth.prototype.getTokenType = function() {
      return this.getToken() ? this.getToken().token_type : undefined;
    }

    /**
     * Remove token.
     */
    OAuth.prototype.removeToken = function() {
      return $cookies.remove(config.sessionName, config.sessionOptions);
    }

    /**
     * Get expiration date.
     */
    OAuth.prototype.getExpirationDate = function() {
      return this.getToken() ? this.getToken().expiration_date : undefined;
    }

    /**
     * Check if access token has expired
     */
    OAuth.prototype.accessTokenExpired = function() {
      var session = $cookies.getObject(config.sessionName);
      if(!session){
        return null;
      }

      var expirationDate = session.expiration_date;
      if(!expirationDate) {
        return null;
      }

      return moment(expirationDate).isBefore();
    }

    return new OAuth();
  };

  this.$get.$inject = ['$injector', '$cookies', '$q', 'moment'];
}
