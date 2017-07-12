
export default oauthConfig;

function oauthConfig($httpProvider) {
  $httpProvider.interceptors.push('cbOAuthRejectExpiredToken');
  $httpProvider.interceptors.push('cbOAuthRefreshExpiredToken');
}

oauthConfig.$inject = ['$httpProvider'];