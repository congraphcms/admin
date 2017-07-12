/**
 * @ngdoc module
 * @name app.components.attributes.textField
 * @description
 *
 * Text Field Attribute
 */

import Controller from './controller.js';
import Directive from './directive.js';

export default 'app.components.attributes.textField';
angular
  .module('app.components.attributes.textField', [])

  .controller('TextFieldEditorController', Controller)
  .directive('textFieldEditor', Directive);
