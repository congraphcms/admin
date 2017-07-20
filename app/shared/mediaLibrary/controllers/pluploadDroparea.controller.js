
import _ from 'underscore';

export default class PluploadDropareaController{
  constructor($scope, $rootScope, $state, $element, $attrs, $document) {

    /* jshint validthis: true */
    var plda = this;

    plda.$scope = $scope;
    plda.$rootScope = $rootScope;
    plda.$element = $element;
    plda.$attrs = $attrs;
    plda.$document = $document;

    plda.init();
  }

  init() {
    var plda = this;
  }
}

PluploadDropareaController.$inject = [
  '$scope', 
  '$rootScope',
  '$state',
  '$element', 
  '$attrs',
  '$document'
];