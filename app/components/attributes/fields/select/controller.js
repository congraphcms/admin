
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class SelectFieldEditorController {
  constructor(
    LocaleRepository, 
    fieldTypes, 
    $scope, 
    $element, 
    $attrs
  ) {
    /* jshint validthis: true */
    let ctrl = this;

    ctrl.$scope = $scope;
    ctrl.$element = $element;
    ctrl.$attrs = $attrs;
    ctrl.LocaleRepository = LocaleRepository;
    ctrl.fieldTypes = fieldTypes;

    ctrl.options = ctrl.$scope.editor.model.attributes.options;

    ctrl.setup();
    ctrl.init();
  }

  setup() {
    let ctrl = this;
  }

  init() {
    let ctrl = this;

    if(!ctrl.options) {
      ctrl.options = [];
    }

    ctrl.locales = [];

    ctrl.$scope.$watch('editor.model.attributes.localized', function(value){
      if(ctrl.$scope.editor.isNew()){
        ctrl.options = [];
      }

      if(value) {
        ctrl.getLocales();
      }
    });

    ctrl.$scope.$watch('fieldCtrl.options', function(value){
      ctrl.$scope.editor.model.attributes.options = value;
    });
  }

  addOption() {
    let ctrl = this;


    let option = {
      value: '',
      label: '',
      default: 0
    };

    if(ctrl.$scope.editor.model.attributes.localized){
      option.locale = ctrl.selectedLocale;
    } else {
      option.locale = 0;
    }

    ctrl.options.splice(0,0,option);
  }

  removeOption(option) {
    let ctrl = this;
    let index = _.indexOf(ctrl.options, option);
    if(index > -1) {
      ctrl.options.splice(index, 1);
    }
  }

  onOptionDefaultChange(option) {
    let ctrl = this;

    let localized = ctrl.$scope.editor.model.attributes.localized;
    let type = ctrl.$scope.editor.model.attributes.field_type;
    let multiple = ctrl.fieldTypes[type].has_multiple_values;

    if(option.default && !multiple) {
      _.each(ctrl.options, function(item){
        if(option == item) {
          return;
        }

        if(localized && option.locale != item.locale) {
          return;
        }

        item.default = 0;

      });
    }
  }

  toggleOptionDefault(option) {
    let ctrl = this;
    option.default = (option.default)?0:1;
  }

  getLocales() {
    let ctrl = this;

    if(ctrl.locales.length > 0) return;

    ctrl.loadingLocales = true;
    ctrl.cbLocaleRepository.get().then(function(result){
      ctrl.localesCollection = result;
      ctrl.locales = result.models;
      ctrl.selectedLocale = ctrl.locales[0].id;
      ctrl.loadingLocales = false;
    });
  }

  getSelectedText() {
    let ctrl = this;
    if (ctrl.selectedLocale !== undefined) {
      // return "Locale: " + ctrl.selectedLocale;
      return "Locale: " + ctrl.localesCollection.findWhere({id:ctrl.selectedLocale}).get('name');
    } else {
      return "Please select a locale";
    }
  }
}

SelectFieldEditorController.$inject = [
  'LocaleRepository',
  'fieldTypes',
  '$scope',
  '$element',
  '$attrs',
];
