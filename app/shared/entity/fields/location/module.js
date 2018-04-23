/**
 * @ngdoc module
 * @name app.shared.entity.location
 * @description
 *
 * Location Fields Handlers (attributes)
 */

import LocationHandlerController from './controllers/locationHandler.controller.js';

import locationHandler from './directives/locationHandler.directive.js';

import ngMap from 'ngmap';

export default 'app.shared.entity.location';

angular
  .module('app.shared.entity.location', [
  	ngMap
  ])
  .controller('LocationHandlerController', LocationHandlerController)
  .directive('locationHandler', locationHandler);
