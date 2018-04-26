/**
 * @ngdoc module
 * @name app.shared.entity
 * @description
 *
 * Entity Fields (attributes)
 */

require("./field.scss");

import ngMaterial from 'angular-material';
import ngMessages from 'angular-messages';

import textFieldsHandlersModule from './fields/text/module.js';
import relationFieldsHandlersModule from './fields/relation/module.js';
import numberFieldsHandlersModule from './fields/number/module.js';
import datetimeFieldsHandlersModule from './fields/datetime/module.js';
import choiceFieldsHandlersModule from './fields/choice/module.js';
import booleanFieldsHandlersModule from './fields/boolean/module.js';
import assetFieldsHandlersModule from './fields/asset/module.js';
import locationFieldsHandlersModule from './fields/location/module.js';

import fieldTypes from './fieldTypes.constant.js';
import fieldSelection from './fieldSelection.constant.js';
import FieldDirective from './directives/cbField.directive.js';
import cbDatepicker from './directives/cbDatepicker.directive.js';
import cbMultiselect from './directives/cbMultiselect.directive.js';
import entityFieldRenderer from './directives/entityFieldRenderer.directive.js';
import entityFieldWalker from './directives/entityFieldWalker.directive.js';
import EntityFieldWalkerController from './controllers/entityFieldWalker.controller.js';

import NullEmptyValidator from './directives/nullEmpty.validator.js';
import ArrayEmptyValidator from './directives/arrayEmpty.validator.js';

export default 'app.shared.entity';

angular
  .module('app.shared.entity', [
    ngMaterial,
    ngMessages,
    textFieldsHandlersModule,
    relationFieldsHandlersModule,
    numberFieldsHandlersModule,
    datetimeFieldsHandlersModule,
    choiceFieldsHandlersModule,
    booleanFieldsHandlersModule,
    assetFieldsHandlersModule,
    locationFieldsHandlersModule
  ])
  .constant('fieldTypes', fieldTypes)
  .constant('fieldSelection', fieldSelection)
  .controller('EntityFieldWalkerController', EntityFieldWalkerController)
  .directive('cbField', FieldDirective)
  .directive('cbDatepicker', cbDatepicker)
  .directive('cbMultiselect', cbMultiselect)
  .directive('entityFieldRenderer', entityFieldRenderer)
  .directive('entityFieldWalker', entityFieldWalker)
  .directive('nullEmpty', NullEmptyValidator)
  .directive('arrayEmpty', ArrayEmptyValidator);