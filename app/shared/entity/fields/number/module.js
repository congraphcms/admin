/**
 * @ngdoc module
 * @name app.shared.entity.number
 * @description
 *
 * Number Fields Handlers (attributes)
 */

import DecimalInputHandlerController from './controllers/decimalInputHandler.controller.js';
import IntegerInputHandlerController from './controllers/integerInputHandler.controller.js';

import DecimalInputHandler from './directives/decimalInputHandler.directive.js';
import IntegerInputHandler from './directives/integerInputHandler.directive.js';

export default 'app.shared.entity.number';

angular
  .module('app.shared.entity.number', [])
  .controller('DecimalInputHandlerController', DecimalInputHandlerController)
  .controller('IntegerInputHandlerController', IntegerInputHandlerController)

  .directive('decimalInputHandler', DecimalInputHandler)
  .directive('integerInputHandler', IntegerInputHandler);