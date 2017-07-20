/**
 * @ngdoc directive
 * @name plupload
 * @module app.shared.mediaLibrary
 *
 * @restrict EA
 *
 * @description
 * `<plupload>`.
 *
 * @usage
 *
 */
export default Plupload;

/**
 * ngInject
 */
function Plupload(){
  	return {
		restrict: 'EA',
	    scope: {
			'params': '=?',
			'multiParams': '=?',
			'instance': '=?',
			'uploaderId': '=?',
			'meta': '=?'
		},
	    controller: 'PluploadController',
	    controllerAs: 'pl',
	    bindToController: true,
	    compile: function(tElement, tAttrs){


			return {
				pre: function preLink(scope, iElement, iAttrs, controller) {

				},
				post: function postLink(scope, iElement, iAttrs, controller) {

				}
			}
		},
	};
}

Plupload.$inject = [];