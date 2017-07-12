/**
 * @ngdoc module
 * @name app.components.attributes.selectField
 * @description
 *
 * Select Field Attribute
 */

import Controller from './controller.js';
import Directive from './directive.js';
import Filter from './filter.js'

export default 'app.components.attributes.selectField';
angular
  .module('app.components.attributes.selectField', [])

  .controller('SelectFieldEditorController', Controller)
  .directive('selectFieldEditor', Directive)
  .filter('localizedOptions', Filter);
