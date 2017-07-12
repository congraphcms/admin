/**
 * @ngdoc module
 * @name app.shared.entity.boolean
 * @description
 *
 * Boolean Fields Handlers (attributes)
 */

import BooleanRadioHandlerController from './controllers/booleanRadioHandler.controller.js';
import BooleanSelectHandlerController from './controllers/booleanSelectHandler.controller.js';

import booleanRadioHandler from './directives/booleanRadioHandler.directive.js';
import booleanSelectHandler from './directives/booleanSelectHandler.directive.js';

export default 'app.shared.entity.boolean';

angular
  .module('app.shared.entity.boolean', [])
  .controller('BooleanRadioHandlerController', BooleanRadioHandlerController)
  .controller('BooleanSelectHandlerController', BooleanSelectHandlerController)
  .directive('booleanRadioHandler', booleanRadioHandler)
  .directive('booleanSelectHandler', booleanSelectHandler);