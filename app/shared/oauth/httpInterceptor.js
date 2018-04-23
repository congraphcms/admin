
export function cbOAuthRejectExpiredToken($q, $rootScope, cbOAuth) {
  console.log('cbOAuthRejectExpiredToken');
  return {
    request: function(config) {
      config.headers = config.headers || {};
      // Inject `Authorization` header.
      if (config.url.indexOf('api/') !== -1 && !config.headers.hasOwnProperty('Authorization')){
        if(!cbOAuth.isAuthenticated()) {
          $rootScope.$emit('oauth:error', {
            error: 'not_authorized',
            message: 'You must log in first.',
            data: {
              config: config
            }
          });
          return $q.reject(
            {
              config: config, 
              data: {
                error: 'not_authorized'
              }
            }
          );
        }
        config.headers.Authorization = cbOAuth.getAuthorizationHeader();
        if(cbOAuth.accessTokenExpired()) {
          return $q.reject(
            {
              config: config, 
              data: {
                error: 'token_expired'
              }
            }
          );
        }
      }

      return config;
    }
  };
}

cbOAuthRejectExpiredToken.$inject = ['$q', '$rootScope', 'cbOAuth'];

export function cbOAuthRefreshExpiredToken($q, $rootScope, cbOAuth) {
  return {
    requestError: function(rejection) {
      var defered = $q.defer();
      if (rejection.data && 'token_expired' === rejection.data.error) {

        if(cbOAuth.refreshingToken) {
          cbOAuth.refreshingTokenPromise
            .then(resolveRefreshToken)
            .catch(rejectRefreshToken);
        } else {
          cbOAuth.refreshToken()
            .then(resolveRefreshToken)
            .catch(rejectRefreshToken);
        }

        return defered.promise;

        function resolveRefreshToken(response) {
          rejection.config.headers.Authorization = cbOAuth.getAuthorizationHeader();
          defered.resolve(rejection.config);
        }

        function rejectRefreshToken(response) {
          cbOAuth.removeToken();
          $rootScope.$emit('oauth:error', {
            error: 'not_authorized',
            message: 'Your session has expired. Please log in.',
            data: {
              config: rejection.config
            }
          });
          defered.reject(rejection);
        }
      }

      return $q.reject(rejection);
    },

    responseError: function(rejection) {
      var defered = $q.defer();
      console.log('responseError interceptor', rejection);
      // Catch `access_denied` and `unauthorized` errors.
      // The token isn't removed here so it can be refreshed when the `access_denied` error occurs.
      if (401 === rejection.status && rejection.data && 'access_denied' === rejection.data.error) {
        console.log('cb interceptor', rejection);
        if(cbOAuth.isAuthenticated() && rejection.config.url.indexOf('api/')){
          cbOAuth.removeToken();
          $rootScope.$emit('oauth:error', {
            error: 'not_authorized',
            message: 'Your session has expired. Please log in.',
            data: {
              config: rejection.config
            }
          });
          defered.reject(rejection);
        }
      }

      return $q.reject(rejection);
    }
  };
}

cbOAuthRefreshExpiredToken.$inject = ['$q', '$rootScope', 'cbOAuth'];
