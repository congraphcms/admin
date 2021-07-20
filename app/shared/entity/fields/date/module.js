/**
 * @ngdoc module
 * @name app.entity.fields.date
 * @description
 *
 * Datetime Fields Handlers (attributes)
 */

import DateInputHandlerController from './controllers/dateInputHandler.controller.js';

import dateInputHandler from './directives/dateInputHandler.directive.js';

export default 'app.entity.fields.date';

angular
  .module('app.entity.fields.date', [])
  .controller('DateInputHandlerController', DateInputHandlerController)
  .directive('dateInputHandler', dateInputHandler);