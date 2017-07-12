/**
 * @ngdoc module
 * @name app.components.entities
 * @description
 *
 * Entity management
 */

require('./styles/editor.scss');

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

export default 'app.components.entities';
angular
  .module('app.components.entities', [
    ngSanitize
  	// contactsComponentModule
  ])
  .controller('EntityListingController', EntityListingController)
  .controller('EntityFormController', EntityFormController)
  .controller('EntityEditorController', EntityEditorController)
  .directive('entityEditor', EntityEditorDirective)
  .service('EntityQuickForm', EntityQuickFormService)
  .controller('EntityQuickFormController', EntityQuickFormController)
  .directive('entityQuickForm', EntityQuickFormDirective)
  .directive('entityFieldUnique', EntityFieldUniqueValidator)

  .config(EntitiesRouterConfig);
