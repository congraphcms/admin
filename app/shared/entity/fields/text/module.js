/**
 * @ngdoc module
 * @name app.shared.entity.text
 * @description
 *
 * Text Fields Handlers (attributes)
 */

import 'angular-ui-tinymce';
import 'tinymce/tinymce'
import 'tinymce/themes/modern/theme'

// Plugins
// import 'tinymce/plugins/paste/plugin'
import 'tinymce/plugins/link/plugin'
// import 'tinymce/plugins/autoresize/plugin'
require.context(
  '!file?name=[path][name].[ext]&context=node_modules/tinymce!tinymce/skins', 
  true, 
  /.*/
)

import htmlEditorController from './controllers/htmlEditorHandler.controller.js';
import tagInputController from './controllers/tagInputHandler.controller.js';
import textAreaController from './controllers/textAreaHandler.controller.js';
import textInputController from './controllers/textInputHandler.controller.js';

import htmlEditorDirective from './directives/htmlEditorHandler.directive.js';
import tagInputDirective from './directives/tagInputHandler.directive.js';
import textAreaDirective from './directives/textAreaHandler.directive.js';
import textInputDirective from './directives/textInputHandler.directive.js';

export default 'app.shared.entity.text';

angular
  .module('app.shared.entity.text', [
  	'ui.tinymce'
  ])
  .controller('HtmlEditorHandlerController', htmlEditorController)
  .controller('TagInputHandlerController', tagInputController)
  .controller('TextAreaHandlerController', textAreaController)
  .controller('TextInputHandlerController', textInputController)

  .directive('htmlEditorHandler', htmlEditorDirective)
  .directive('tagInputHandler', tagInputDirective)
  .directive('textAreaHandler', textAreaDirective)
  .directive('textInputHandler', textInputDirective);