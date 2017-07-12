

export default class EntityFieldWalkerController{
  constructor(fieldTypes, $scope, $rootScope, $state, $stateParams, $q, $timeout) {

    /* jshint validthis: true */
    var walker = this;

    walker.$scope = $scope;
    walker.$rootScope = $rootScope;
    walker.$state = $state;
    walker.$stateParams = $stateParams;
    walker.$q = $q;
    walker.$timeout = $timeout;

    walker.fieldTypes =  fieldTypes;
  }

  fieldValid(attribute) {
    var walker = this;
    var fieldInputName = 'field-'+attribute.get('code');
    var input = walker.form[fieldInputName];
    if( ! input ) {
      return true;
    }

    return input.$valid || (input.$untouched && ! walker.form.$submitted);
  }

  fieldInvalid (attribute) {
    return ! this.fieldValid(attribute);
  }

  isComplexField(attribute) {
    var walker = this;

    var fieldSettings = walker.fieldTypes[attribute.get('field_type')];
    var inputChoices = fieldSettings.input_choice;
    var defaultInput = fieldSettings.default_input;
    var attributeData = attribute.get('data');
    var input = (attributeData && attributeData.input_type)?attributeData.input_type:defaultInput;
    var inputSettings = inputChoices[input];

    return inputSettings && inputSettings.complex;

  }

}

EntityFieldWalkerController.$inject = [
  'fieldTypes',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];