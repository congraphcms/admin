/**
 * @ngdoc module
 * @name app.shared.entity.asset
 * @description
 *
 * Asset Fields Handlers (attributes)
 */

import mediaLibraryModule from './../../../mediaLibrary/module.js';

import MediaLibraryHandlerController from './controllers/mediaLibraryHandler.controller.js';

import mediaLibraryHandler from './directives/mediaLibraryHandler.directive.js';

export default 'app.shared.entity.asset';

angular
  .module('app.shared.entity.asset', [
  	mediaLibraryModule
  ])
  .controller('MediaLibraryHandlerController', MediaLibraryHandlerController)
  .directive('mediaLibraryHandler', mediaLibraryHandler);