/**
 * @ngdoc module
 * @name app.components.media
 * @description
 *
 * Media management
 */

import MediaRouterConfig from './router.js';
import MediaListingController from './controllers/mediaListing.controller.js';
// import AttributeFormController from './controllers/attributeForm.controller.js';
// import AttributeEditorController from './controllers/attributeEditor.controller.js';
// import AttributeEditorDirective from './directives/attributeEditor.directive.js';
// import AttributeCodeUniqueValidator from './directives/attributeCodeUnique.validator.js';


export default 'app.components.media';

angular
  .module('app.components.media', [])
  .controller('MediaListingController', MediaListingController)
  // .controller('AttributeFormController', AttributeFormController)
  // .controller('AttributeEditorController', AttributeEditorController)
  // .directive('attributeEditor', AttributeEditorDirective)
  // .directive('attributeCodeUnique', AttributeCodeUniqueValidator)
  // .constant('AttributeSettings', AttributeSettings)


  .config(MediaRouterConfig);
