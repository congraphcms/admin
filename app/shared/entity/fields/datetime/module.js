/**
 * @ngdoc module
 * @name app.entity.fields.datetime
 * @description
 *
 * Datetime Fields Handlers (attributes)
 */

import DateInputHandlerController from './controllers/dateInputHandler.controller.js';

import dateInputHandler from './directives/dateInputHandler.directive.js';

export default 'app.entity.fields.datetime';

angular
  .module('app.entity.fields.datetime', [])
  .controller('DateInputHandlerController', DateInputHandlerController)
  .directive('dateInputHandler', dateInputHandler);