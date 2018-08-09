/**
 * @ngdoc module
 * @name app.components.entities
 * @description
 *
 * Entity management
 */

import './styles/editor.scss';

import ngSanitize from 'angular-sanitize';

import EntitiesRouterConfig from './router.js';
import EntityListingController from './controllers/entityListing.controller.js';
import EntityFormController from './controllers/entityForm.controller.js';
import EntityEditorController from './controllers/entityEditor.controller.js';
import EntityEditorDirective from './directives/entityEditor.directive.js';

import EntityQuickFormService  from './services/entityQuickForm.service.js';
import EntityQuickFormController  from './controllers/entityQuickForm.controller.js';
import EntityQuickFormDirective  from './directives/entityQuickForm.directive.js';

import EntityFieldUniqueValidator from './directives/entityFieldUnique.validator.js';

/*
  Nikjov added 20180623
*/
import QueryBuilderDirective from './directives/queryBuilder.directive.js';
import QueryBuilderService from './services/queryBuilder.service.js';
import ConditionBuilderDirective from './directives/conditionBuilder.directive.js';
import QueryBuilderConstant from './constants/queryBuilder.constant.js';
import QueryBuilderController from './controllers/queryBuilder.controller.js';
import ConditionBuilderController from './controllers/conditionBuilder.controller.js';


export default 'app.components.entities';
angular
  .module('app.components.entities', [
    ngSanitize
  ])
  .controller('EntityListingController', EntityListingController)
  .controller('EntityFormController', EntityFormController)
  .controller('EntityEditorController', EntityEditorController)
  .directive('entityEditor', EntityEditorDirective)
  .service('EntityQuickForm', EntityQuickFormService)
  .controller('EntityQuickFormController', EntityQuickFormController)
  .directive('entityQuickForm', EntityQuickFormDirective)
  .directive('entityFieldUnique', EntityFieldUniqueValidator)

  .controller('QueryBuilderController', QueryBuilderController)
  .controller('ConditionBuilderController', ConditionBuilderController)
  .directive('queryBuilder', QueryBuilderDirective)
  .service('queryBuilderService', QueryBuilderService)

  .directive('conditionBuilder', ConditionBuilderDirective)
  .constant('queryBuilderConstant', QueryBuilderConstant)

  .config(EntitiesRouterConfig);
