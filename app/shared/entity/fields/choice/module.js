/**
 * @ngdoc module
 * @name app.shared.entity.choice
 * @description
 *
 * Choice Fields Handlers (attributes)
 */

import CheckboxHandlerController from './controllers/checkboxHandler.controller.js';
import RadioInputHandlerController from './controllers/radioInputHandler.controller.js';
import SelectInputHandlerController from './controllers/selectInputHandler.controller.js';

import CheckboxHandler from './directives/checkboxHandler.directive.js';
import RadioInputHandler from './directives/radioInputHandler.directive.js';
import SelectInputHandler from './directives/selectInputHandler.directive.js';

export default 'app.shared.entity.choice';

angular
  .module('app.shared.entity.choice', [])
  .controller('CheckboxHandlerController', CheckboxHandlerController)
  .controller('RadioInputHandlerController', RadioInputHandlerController)
  .controller('SelectInputHandlerController', SelectInputHandlerController)
  
  .directive('checkboxHandler', CheckboxHandler)
  .directive('radioInputHandler', RadioInputHandler)
  .directive('selectInputHandler', SelectInputHandler);