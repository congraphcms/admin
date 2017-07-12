/**
 * @ngdoc module
 * @name app.components.attributes
 * @description
 *
 * Attribute management
 */

// require('./styles/editor.scss');

// import ngSanitize from 'angular-sanitize';

import AttributesRouterConfig from './router.js';
import AttributeListingController from './controllers/attributeListing.controller.js';
import AttributeFormController from './controllers/attributeForm.controller.js';
import AttributeEditorController from './controllers/attributeEditor.controller.js';
import AttributeEditorDirective from './directives/attributeEditor.directive.js';
import AttributeCodeUniqueValidator from './directives/attributeCodeUnique.validator.js';

import AttributeSettings from './settings.js';


// Field Types
import TextFieldModule from './fields/text/module.js';
import SelectFieldModule from './fields/select/module.js';
import RelationFieldModule from './fields/relation/module.js';
import NumberFieldModule from './fields/number/module.js';
import AssetFieldModule from './fields/asset/module.js';


export default 'app.components.attributes';
angular
  .module('app.components.attributes', [
  	TextFieldModule,
  	SelectFieldModule,
    RelationFieldModule,
    NumberFieldModule,
    AssetFieldModule
  ])

  .controller('AttributeListingController', AttributeListingController)
  .controller('AttributeFormController', AttributeFormController)
  .controller('AttributeEditorController', AttributeEditorController)
  .directive('attributeEditor', AttributeEditorDirective)
  .directive('attributeCodeUnique', AttributeCodeUniqueValidator)
  .constant('AttributeSettings', AttributeSettings)


  .config(AttributesRouterConfig);
