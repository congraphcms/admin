import _ from 'underscore';

export default class EntityFieldWalkerController{
  constructor(fieldTypes, $scope, $rootScope, $state, $stateParams, $q, $timeout) {

    /* jshint validthis: true */
    let walker = this;

    walker.$scope = $scope;
    walker.$rootScope = $rootScope;
    walker.$state = $state;
    walker.$stateParams = $stateParams;
    walker.$q = $q;
    walker.$timeout = $timeout;

    walker.fieldTypes =  fieldTypes;

    walker.init();

    walker.$rootScope.$on('entitySaved', function (event, editor, model) {
      if (editor == walker.editor) {
        walker.entity = model;
      }
    });
  }

  init() {
    let walker = this;
    walker.setAttributes = [];

    _.each(walker.attributeSet.get('attributes').models, function(attrMock) {
      let attribute = walker.attributes.findWhere({id: attrMock.id});
      if(attribute) {
        walker.setAttributes.push(attribute);
        return;
      }

      cosole.warn('One of attributes from set is not present in allAttributes collection', attrMock);
    });
  }

  fieldValid(attribute) {
    let walker = this;
    let fieldInputName = 'field-'+attribute.get('code');
    let input = walker.form[fieldInputName];
    if( ! input ) {
      return true;
    }

    return input.$valid || (input.$untouched && ! walker.form.$submitted);
  }

  fieldInvalid (attribute) {
    return ! this.fieldValid(attribute);
  }

  isComplexField(attribute) {
    let walker = this;

    let fieldSettings = walker.fieldTypes[attribute.get('field_type')];
    let inputChoices = fieldSettings.input_choice;
    let defaultInput = fieldSettings.default_input;
    let attributeData = attribute.get('data');
    let input = (attributeData && attributeData.input_type)?attributeData.input_type:defaultInput;
    let inputSettings = inputChoices[input];

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