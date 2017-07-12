/**
 * @ngdoc module
 * @name app.components.attributes.numberField
 * @description
 *
 * Number Field Attribute
 */

import Controller from './controller.js';
import Directive from './directive.js';

export default 'app.components.attributes.numberField';
angular
  .module('app.components.attributes.numberField', [])

  .controller('NumberFieldEditorController', Controller)
  .directive('numberFieldEditor', Directive);
