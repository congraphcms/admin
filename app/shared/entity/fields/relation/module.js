/**
 * @ngdoc module
 * @name app.shared.entity.relation
 * @description
 *
 * Relation Fields Handlers (attributes)
 */

import RelationSearchHandlerController from './controllers/relationSearchHandler.controller.js';

import relationSearchHandler from './directives/relationSearchHandler.directive.js';

export default 'app.shared.entity.relation';

angular
  .module('app.shared.entity.relation', [])
  .controller('RelationSearchHandlerController', RelationSearchHandlerController)
  .directive('relationSearchHandler', relationSearchHandler);