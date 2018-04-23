/**
 * @ngdoc directive
 * @name pluploadDroparea
 * @module app.shared.mediaLibrary
 *
 * @restrict EA
 *
 * @description
 * `<plupload-droparea>`.
 *
 * @usage
 *
 */
import template from './../views/pluploadDroparea.tmpl.html';
export default pluploadDroparea;

/**
 * ngInject
 */
function pluploadDroparea($state){
  	return {
		restrict: 'EA',
    	template: template,
	    scope: {
			'params': '=?',
			'multiParams': '=?',
			'instance': '=?',
			'uploaderId': '=?',
			'meta': '=?',
			'infoText': '=?',
			'dropElement': '=?'
		},
	    controller: 'PluploadDropareaController',
	    controllerAs: 'plda',
	    bindToController: true,
	    compile: function(tElement, tAttrs){
			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {
					if(!scope.infoText){
						scope.infoText = "Drag images here";
					}

					var defaultParams = {};
					if(controller.dropElement){
						defaultParams.drop_element = controller.dropElement[0];
					}

					if(!controller.params){
						controller.params = {};
					}
					var params = {};
					angular.extend(params, defaultParams, controller.params);

					controller.params = params;
				},
				post: function postLink(scope, iElement, iAttrs, controller) {
					var target = angular.element( document.querySelector( '#' + iAttrs.dropareaid ) );
					target.ondragenter = function() {
						angular.element(this).addClass('dragover');
					};

					target.ondragleave = function() {
						angular.element(this).removeClass('dragover');
					};

					target.ondrop = function() {
						angular.element(this).removeClass('dragover');
					};
				}
			}
		},
	};
}

pluploadDroparea.$inject = ['$state'];