
import template from './views/login.tmpl.html'
export default LoginRouterConfig;

function LoginRouterConfig($stateProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      params: {
        error: null,
        redirect: null,
        redirectParams: null
      },
      template: template,
      controller: 'LoginController',
      controllerAs: 'vm'
    });
}

LoginRouterConfig.$inject = [
  '$stateProvider'
];