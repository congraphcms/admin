/**
 * @ngdoc module
 * @name app.components.attributes.relationField
 * @description
 *
 * Relation Field Attribute
 */

import Controller from './controller.js';
import Directive from './directive.js';

export default 'app.components.attributes.relationField';
angular
  .module('app.components.attributes.relationField', [])

  .controller('RelationFieldEditorController', Controller)
  .directive('relationFieldEditor', Directive);
