/**
 * @ngdoc module
 * @name app.components.dashboard
 * @description
 *
 * Dashboard
 */

import DashboardRouterConfig from './router.js';
import DashboardController from './controllers/dashboard.controller.js';

export default 'app.components.dashboard';
angular
  .module('app.components.dashboard', [])
  .controller('DashboardController', DashboardController)
  .config(DashboardRouterConfig);
