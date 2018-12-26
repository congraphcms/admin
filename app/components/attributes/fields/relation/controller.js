
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class RelationFieldEditorController {
  constructor(
    EntityTypeRepository,
    $scope,
    $element,
    $attrs
  ) {
    /* jshint validthis: true */
    let ctrl = this;

    ctrl.$scope = $scope;
    ctrl.$element = $element;
    ctrl.$attrs = $attrs;

    ctrl.EntityTypeRepository = EntityTypeRepository;

    ctrl.data = ctrl.$scope.editor.model.attributes.data;
    if( ! _.isObject(ctrl.data) ) {
      ctrl.data = {};
    }
    ctrl.hasTypeValidation = false;
    ctrl.allowedTypes = [];
    ctrl.ready = false;
    ctrl.empty = true;

    ctrl.setup();

    ctrl.init();
  }

  setup() {
    let ctrl = this;

    if( ctrl.data.allowed_types && ctrl.data.allowed_types.length > 0 ) {
      ctrl.hasTypeValidation = true;
    }
  }

  init() {
    let ctrl = this;

    ctrl.$scope.$watch('fieldCtrl.hasTypeValidation', function(newValue, oldValue){
      if(newValue == oldValue) {
        return;
      }

      if( ! newValue ) {
        ctrl.data.allowed_types = false;
      } else {
        ctrl.data.allowed_types = [];
      }
    });

    ctrl.getEntityTypes();
  }

  getEntityTypes() {
    let ctrl = this;

    ctrl.EntityTypeRepository.get().then(
      function(results){

        // store collection
        ctrl.entityTypesCollection = results;
        // optionaly change collection (filter, sort etc)
        ctrl.entityTypes = ctrl.entityTypesCollection.models;

        // set listing flags
        ctrl.ready = true;
        ctrl.empty = !results.length;

        ctrl.findAllowedTypes();
      },
      function(errors){
        console.error('can\'t get entity types', errors)
      }
    );
  }

  findAllowedTypes() {
    let ctrl = this;

    _.each(ctrl.entityTypes, function(type){
      if(_.indexOf(ctrl.data.allowed_types, type.attributes.id) > -1 && _.indexOf(ctrl.allowedTypes, type) == -1){
        ctrl.allowedTypes.push(type);
      }
    });
  }

  allowedType(type) {
    return _.indexOf(this.allowedTypes, type) > -1;
  }

  toggleType(type) {
    console.log('allowedType toggle', type);
    console.log('this.allowedTypes', this.allowedTypes);
    let index = _.indexOf(this.allowedTypes, type);
    if(index > -1) {
      console.log('type already checked, remove it');
      this.allowedTypes.splice(index, 1);
      index = _.indexOf(this.data.allowed_types, type.attributes.id);
      this.data.allowed_types.splice(index, 1);
      return;
    }

    console.log('type not checked, add it');
    this.allowedTypes.push(type);
    this.data.allowed_types.push(type.attributes.id);
  }

  isNew() {
    return this.attributeModel.isNew();
  }
}

RelationFieldEditorController.$inject = [
  'EntityTypeRepository',
  '$scope',
  '$element',
  '$attrs'
];
