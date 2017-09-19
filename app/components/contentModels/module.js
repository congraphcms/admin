/**
 * @ngdoc module
 * @name app.components.contentModel
 * @description
 *
 * Content Model management
 */

// router config
import ContentModelRouterConfig from './router.js';

// listing
import ContentModelListingController from './controllers/contentModelListing.controller.js';

// detail
import ContentModelDetailController from './controllers/contentModelDetail.controller.js';

// general form
import ContentModelGeneralFormController from './controllers/contentModelGeneralForm.controller.js';
import ContentModelGeneralEditorController from './controllers/contentModelGeneralEditor.controller.js';
import ContentModelGeneralEditorDirective from './directives/contentModelGeneralEditor.directive.js';
import ContentModelCodeUniqueValidator from './directives/contentModelCodeUnique.validator.js';
import ContentModelEndpointUniqueValidator from './directives/contentModelEndpointUnique.validator.js';

// new form
import ContentModelNewFormController from './controllers/contentModelNewForm.controller.js';
import ContentModelNewEditorController from './controllers/contentModelNewEditor.controller.js';
import ContentModelNewEditorDirective from './directives/contentModelNewEditor.directive.js';

// workflow form
import ContentModelWorkflowFormController from './controllers/contentModelWorkflowForm.controller.js';
import ContentModelWorkflowEditorController from './controllers/contentModelWorkflowEditor.controller.js';
import ContentModelWorkflowEditorDirective from './directives/contentModelWorkflowEditor.directive.js';

// attribute set form
import AttributeSetFormController from './controllers/attributeSetForm.controller.js';
import AttributeSetEditorController from './controllers/attributeSetEditor.controller.js';
import AttributeSetEditorDirective from './directives/attributeSetEditor.directive.js';

import AvailableAttributesFilter from './filters/availableAttributes.filter.js';
import AvailableAttributesSearchFilter from './filters/availableAttributesSearch.filter.js';

import AttributeSetCodeUniqueValidator from './directives/attributeSetCodeUnique.validator.js';


export default 'app.components.contentModel';
angular
  .module('app.components.contentModel', [])
  // listing
  .controller('ContentModelListingController', ContentModelListingController)
  // detail
  .controller('ContentModelDetailController', ContentModelDetailController)
  // general form
  .controller('ContentModelGeneralFormController', ContentModelGeneralFormController)
  .controller('ContentModelGeneralEditorController', ContentModelGeneralEditorController)
  .directive('contentModelGeneralEditor', ContentModelGeneralEditorDirective)
  .directive('contentModelCodeUnique', ContentModelCodeUniqueValidator)
  .directive('contentModelEndpointUnique', ContentModelEndpointUniqueValidator)
  // new form
  .controller('ContentModelNewFormController', ContentModelNewFormController)
  .controller('ContentModelNewEditorController', ContentModelNewEditorController)
  .directive('contentModelNewEditor', ContentModelNewEditorDirective)
  // workflow form
  .controller('ContentModelWorkflowFormController', ContentModelWorkflowFormController)
  .controller('ContentModelWorkflowEditorController', ContentModelWorkflowEditorController)
  .directive('contentModelWorkflowEditor', ContentModelWorkflowEditorDirective)
  // attribute set form
  .controller('AttributeSetFormController', AttributeSetFormController)
  .controller('AttributeSetEditorController', AttributeSetEditorController)
  .directive('attributeSetEditor', AttributeSetEditorDirective)
  // filters
  .filter('availableAttributes', AvailableAttributesFilter)
  .filter('availableAttributesSearch', AvailableAttributesSearchFilter)

  .directive('attributeSetCodeUnique', AttributeSetCodeUniqueValidator)

  // router config
  .config(ContentModelRouterConfig);
