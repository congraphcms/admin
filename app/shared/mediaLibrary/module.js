/**
 * @ngdoc module
 * @name app.shared.mediaLibrary
 * @description
 *
 * Media Library
 */

require('./styles/droparea.scss');

import MediaUploaderController from './controllers/mediaUploader.controller.js';
import PluploadController from './controllers/plupload.controller.js';
import PluploadDropareaController from './controllers/pluploadDroparea.controller.js';

import mediaUploader from './directives/mediaUploader.directive.js';
import plupload from './directives/plupload.directive.js';
import pluploadDroparea from './directives/pluploadDroparea.directive.js';

export default 'app.shared.mediaLibrary';

angular
  .module('app.shared.mediaLibrary', [])
  .controller('MediaUploaderController', MediaUploaderController)
  .controller('PluploadController', PluploadController)
  .controller('PluploadDropareaController', PluploadDropareaController)

  .directive('mediaUploader', mediaUploader)
  .directive('plupload', plupload)
  .directive('pluploadDroparea', pluploadDroparea);
