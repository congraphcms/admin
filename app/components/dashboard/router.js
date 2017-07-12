import template from './views/dashboard.tmpl.html';

export default function DashboardRouterConfig($stateProvider) {

  $stateProvider
    .state('app.dashboard', {
      url: '/',
      template: template,
      requireAuth: true,
      controller: 'DashboardController',
      controllerAs: 'vm'
    });
}

DashboardRouterConfig.$inject = [
  '$stateProvider'
];
