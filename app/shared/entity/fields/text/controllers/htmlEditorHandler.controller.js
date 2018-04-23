
import _ from 'underscore';

export default class HtmlEditorHandlerController{
  constructor($scope, $rootScope, $state, $stateParams, $q, $timeout) {

    /* jshint validthis: true */
    var handler = this;

    handler.$scope = $scope;
    handler.$rootScope = $rootScope;
    handler.$state = $state;
    handler.$stateParams = $stateParams;
    handler.$q = $q;
    handler.$timeout = $timeout;

    handler.tmceOptions = {
      menubar: false,
      // theme:'modern',
      // skin:'light',
      plugins: [ 'lists link image code preview fullscreen' ],
      toolbar: 'insert | undo redo |  styleselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code preview fullscreen',
    };

    handler.attribute = handler.$scope.attribute;
    handler.entity = handler.$scope.entity;

    handler.init();
  }

  init() {
    var handler = this;

    handler.fieldCode = handler.attribute.get('code');
    handler.fieldName = handler.attribute.get('admin_label');
    handler.required = handler.attribute.get('required');
    handler.unique = handler.attribute.get('unique');

    var value = handler.entity.getField(handler.fieldCode);

    if(_.isUndefined(value)) {
      value = '';
      handler.entity.setField(handler.fieldCode, value);
    }

    if(handler.entity.isNew()) {
      handler.setDefaultValue();
    }

  }

  setDefaultValue() {
    var handler = this;
    var defaultValue = handler.attribute.get('default_value');
    if(defaultValue) {
      handler.entity.setField(handler.fieldCode, defaultValue);
    }
  }
}

HtmlEditorHandlerController.$inject = [
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q',
  '$timeout',
];
