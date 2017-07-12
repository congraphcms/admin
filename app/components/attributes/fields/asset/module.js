/**
 * @ngdoc module
 * @name app.components.attributes.assetField
 * @description
 *
 * Asset Field Attribute
 */

import Controller from './controller.js';
import Directive from './directive.js';

export default 'app.components.attributes.assetField';
angular
  .module('app.components.attributes.assetField', [])

  .controller('AssetFieldEditorController', Controller)
  .directive('assetFieldEditor', Directive);
