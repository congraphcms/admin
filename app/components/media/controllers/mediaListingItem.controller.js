import angular from 'angular';
// import IntersectionObserver from 'intersection-observer';
require('intersection-observer');

export default class MediaListingItemController {
  constructor(
    $element,
    $scope,
    $rootScope,
    $q, 
    $timeout ){
    

    /* jshint validthis: true */
    var vm = this;
    
    vm.$element = $element;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.init();
  }

  init() {
    var vm = this;

    vm.$scope.$watch('vm.item', function(value) {
      if( ! value ) {
        return;
      }
      const observer = new IntersectionObserver(angular.bind(vm, vm.loadImage));
      const itemElement = vm.$element[0];
      observer.observe(itemElement);
    });
    
    // console.log("[MediaListingItemController] -> ", vm, vm.item);
  }

  loadImage(changes) {
    const vm = this;
    changes.forEach( change => {
      if(change.target == vm.$element[0] && change.intersectionRatio > 0) {
        let img = new Image();
        img.onload = function() {
          vm.$scope.$apply(function(){
            vm.item.isLoaded = true;
          });
        };

        img.src = vm.item.getAdminImageUrl();
      }
    });
  }
}

MediaListingItemController.$inject = [
  '$element',
  '$scope',
  '$rootScope',
  '$q', 
  '$timeout',
];