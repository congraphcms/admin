/**
 * @ngdoc module
 * @name app.components.locales
 * @description
 *
 * Locale management
 */

import LocalesRouterConfig from './router.js';
import LocaleListingController from './controllers/localeListing.controller.js';
import LocaleFormController from './controllers/localeForm.controller.js';
import LocaleEditorController from './controllers/localeEditor.controller.js';
import LocaleEditorDirective from './directives/localeEditor.directive.js';
import LocaleCodeUniqueValidator from './directives/localeCodeUnique.validator.js';


export default 'app.components.locales';
angular
  .module('app.components.locales', [])

  .controller('LocaleListingController', LocaleListingController)
  .controller('LocaleFormController', LocaleFormController)
  .controller('LocaleEditorController', LocaleEditorController)
  .directive('localeEditor', LocaleEditorDirective)
  .directive('localeCodeUnique', LocaleCodeUniqueValidator)

  .config(LocalesRouterConfig);
