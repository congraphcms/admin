/**
 * @ngdoc directive
 * @name mediaUploader
 * @module app.shared.mediaLibrary
 *
 * @restrict EA
 *
 * @description
 * `<media-uploader>`.
 *
 * @usage
 *
 */
import template from './../views/mediaUploader.tmpl.html';
export default mediaUploader;

/**
 * ngInject
 */
function mediaUploader(){
  	return {
		restrict: 'EA',
    	template: template,
	    scope: {
			'files': '=?',
			'selection': '=?',
			'multipleSelection': '=?',
			'params': '=?',
		},
	    controller: 'MediaUploaderController',
	    controllerAs: 'mu',
	    bindToController: true
	};
}

mediaUploader.$inject = [];