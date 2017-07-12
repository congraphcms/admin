/**
 * @ngdoc module
 * @name app.shared.helpers
 * @description
 *
 * Misc helpers
 */

import cbOnEnter from './directives/cbOnEnter.directive.js';
import ChooseSetService from './services/chooseSet.service.js';
import {createEntityLink, CreateEntityLinkController} from './directives/createEntityLink.directive.js';

export default 'app.shared.helpers';

angular
  .module('app.shared.helpers', [])
  .directive('cbOnEnter', cbOnEnter)
  .controller('CreateEntityLinkController', CreateEntityLinkController)
  .directive('createEntityLink', createEntityLink)
  .service('ChooseSetService', ChooseSetService);