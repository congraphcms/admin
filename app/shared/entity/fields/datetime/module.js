/**
 * @ngdoc module
 * @name app.entity.fields.datetime
 * @description
 *
 * Datetime Fields Handlers (attributes)
 */

import DatetimeInputHandlerController from './controllers/datetimeInputHandler.controller.js';

import datetimeInputHandler from './directives/datetimeInputHandler.directive.js';

export default 'app.entity.fields.datetime';

angular
  .module('app.entity.fields.datetime', [])
  .controller('DatetimeInputHandlerController', DatetimeInputHandlerController)
  .directive('datetimeInputHandler', datetimeInputHandler);