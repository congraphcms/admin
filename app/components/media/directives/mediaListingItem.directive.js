/**
 * @ngdoc directive
 * @name mediaListingItem
 * @module app.components.media
 *
 * @restrict E
 *
 * @description
 * `<media-listing-item>`.
 *
 * @usage
 *
 */

import template from './../views/mediaListingItem.tmpl.html';

/**
 * ngInject
 */
export default function MediaListingItemDirective(){
  return {
    restrict: 'E',
    template: template,
    scope: {
      item: "=",
      onEdit: "&",
      onDelete: "&",
      busy: "&"
    },
    controller: 'MediaListingItemController',
    controllerAs: 'vm',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    // var attribtueEditorCtrl = _.isArray(ctrls) ? ctrls[0] : ctrls;
    // attribtueEditorCtrl.init();

    // scope.$on('$destroy', function() {
    //   attribtueEditorCtrl
    //     .destroy()
    //     .finally(function(){
    //       menuContainer.remove();
    //     });
    // });
  }
}

MediaListingItemDirective.$inject = [];
