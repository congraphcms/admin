/**
 * @ngdoc module
 * @name app.shared.fields.compound
 * @description
 *
 * Compound Fields Handlers (attributes)
 */



import compoundController from './controllers/compoundHandler.controller.js';

import compoundDirective from './directives/compoundHandler.directive.js';

export default 'app.shared.fields.compound';

angular
  .module('app.shared.fields.compound', [])
  .controller('CompoundHandlerController', compoundController)

  .directive('compoundHandler', compoundDirective);