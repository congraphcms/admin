
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class AttributeEditorController {
  constructor(
    EditorRegistry, 
    AttributeRepository, 
    fieldTypes, 
    fieldSelection,
    $mdToast,
    $attrs, 
    $element, 
    $scope, 
    $rootScope, 
    $state, 
    $q, 
    $timeout, 
    $compile
  ) {


    /* jshint validthis: true */
    let vm = this;

    vm.fieldTypes = fieldTypes;
    vm.fieldSelection = fieldSelection;

    vm.form = $element.controller('form');

    vm.$mdToast = $mdToast;
    vm.$attrs = $attrs;
    vm.$element = $element;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$q = $q;
    vm.$timeout = $timeout;
    vm.$compile = $compile;
    vm.model = vm.attributeModel;

    vm.EditorRegistry = EditorRegistry;

    vm.AttributeRepository = AttributeRepository;

    vm.init();
  }

  init() {
    let vm = this;

    vm.$scope.$watch('editor.model.attributes.field_type', function(value) {
      if( ! value ) {
        return;
      }

      let $fieldEditorContainer = vm.$element.find("field-editor");
      let editor = vm.fieldTypes[value].editor;
      let html = '<' + editor + '-field-editor></' + editor + '-field-editor>';
      
      // Step 1: parse HTML into DOM element
      let template = angular.element(html);

      // Step 2: compile the template
      let linkFn = vm.$compile(template);

      // Step 3: link the compiled template with the scope.
      let element = linkFn(vm.$scope);

      // Step 4: Append to DOM (optional)
      $fieldEditorContainer.empty().append(element);
    });

    vm.$scope.$watch('editor.form.$pending', function(newValue) {

      if(newValue == undefined) {
        vm.busy = false;
      } else {
        vm.busy = true;
      }
    });

    vm.deregister = vm.EditorRegistry.register(this, vm.model);

    if(vm.isNew()) {
      vm.activeStep = 1;
    } else {
      this.selectedField = this.findType(vm.model.attributes.field_type);
      this.selectedInput = this.findInput(vm.model.attributes.data);
      if( ! this.selectedField ) {
        throw new Error("Invalid Field Type");
      }

      if( this.fieldTypes[vm.model.attributes.field_type].has_input_choice && ! this.selectedInput ) {
        vm.activeStep = 3;
        return;
      }

      vm.activeStep = 4;
    }
  }

  nextStep() {
    let nextStep = (this.activeStep < 4) ? this.activeStep + 1 : 4;
    this.goToStep(nextStep);
  }

  prevStep() {
    let prevStep = (this.activeStep > 1) ? this.activeStep - 1 : 1;
    this.goToStep(prevStep);
  }

  goToStep(step) {
    this.previousStep = this.activeStep;
    switch(step) {
      case 1:
        this.chooseType();
        break;
      case 2:
        this.chooseSubType();
        break;
      case 3:
        this.chooseInput();
        break;
      case 4:
      default:
        this.editField();
        break;
    }
  }

  chooseType() {
    if( ! this.isNew() ) {
      this.goToStep(this.previousStep);
      return;
    }

    this.attributeModel.attributes.field_type = null;
    this.selectedField = null;
    this.activeStep = 1;
  }

  chooseSubType() {
    if( ! this.isNew() ) {
      this.goToStep(this.previousStep);
      return;
    }

    if( ! this.selectedField.sub_choices ) {
      if(this.previousStep == 1) {
        this.goToStep(3);
      } else {
        this.goToStep(1);
      }
      return;
    }

    this.activeStep = 2;
  }

  chooseInput() {
    if( ! this.fieldTypes[this.model.attributes.field_type].has_input_choice ) {
      if(this.previousStep == 4) {
        return
      } else {
        this.goToStep(4);
      }
      return;
    }
    // this.attributeModel.attributes.data.input_type;
    this.activeStep = 3;
  }

  editField() {
    if( ! this.model.attributes.field_type ) {
      this.goToStep(1);
    }

    this.activeStep = 4;
  }


  findType(fieldType) {
    let result = null;
    _.each(this.fieldSelection, function(type) {
      if( type.sub_choices ) {
        _.each(type.sub_choices, function(subType) {
          if(subType.value == fieldType) {
            result = type;
            return;
          }
        });
        return;
      }

      if(type.value == fieldType) {
        result = type;
      }
      return;
    });

    return result;
  }

  findInput(data) {
    if( ! this.fieldTypes[this.model.attributes.field_type].has_input_choice ) {
      return null;
    }

    if( ! _.isObject(data) || ! data.input_type ) {
      return null;
    }

    let inputChoices = this.fieldTypes[this.model.attributes.field_type].input_choice;
    let selectedInput = null;
    _.each(inputChoices, function(choice) {

      if(data.input_type == choice.value) {
        selectedInput = choice;
        return;
      }
    });

    return selectedInput;
  }

  isNew() {
    return this.attributeModel.isNew();
  }

  getType() {
    return this.attributeModel.attributes.field_type || false;
  }

  hasSubChoice() {
    return this.selectedField && this.selectedField.sub_choices;
  }

  selectField(selection) {
    let vm = this;
    if (!vm.attributeModel.isNew()) {
      return false;
    }

    vm.selectedField = selection;

    if(selection.value) {
      vm.setFieldType(selection.value);
    }

    vm.nextStep();
  }

  selectFieldSubType(selection) {
    let vm = this;
    if (!vm.attributeModel.isNew()) {
      return false;
    }

    if(selection.value) {
      vm.setFieldType(selection.value);
    }

    vm.nextStep();
  }

  selectInput(selection) {
    let vm = this;

    vm.selectedInput = selection;

    if(selection.value) {
      vm.setFieldInput(selection.value);
    }

    vm.nextStep();
  }

  setFieldType(type) {
    let vm = this;
    if (!vm.attributeModel.isNew()) {
      return false;
    }

    vm.attributeModel.set('field_type', type);
  }

  setFieldInput(inputType) {
    let vm = this;
    if( ! _.isObject(this.model.attributes.data) || this.model.attributes.data == null) {
      this.model.attributes.data = {};
    }

    this.model.attributes.data.input_type = inputType;
  }

  save() {
    let vm = this;
    
    vm.form.$setDirty(true);
    vm.form.$setSubmitted(true);

    if(vm.form.$invalid) {

      let defered = vm.$q.defer();
      defered.reject({error: "Invalid form"});
      return defered.promise;
    }
    vm.busy = true;
    let promise = vm.AttributeRepository.save(vm.model);
    promise.then(function(result){


      vm.deregister();
      vm.model = vm.attributeModel = result;
      vm.deregister = vm.EditorRegistry.register(vm, result);
      vm.busy = false;
      vm.form.$setDirty(false);
      vm.form.$setPristine(true);

      vm.$mdToast.show(
        vm.$mdToast.simple()
          .textContent('Attribute successfully saved.')
          .position('top right')
          .theme('success-toast')
          .parent(vm.$element)
      );


      return result;
    }, function(errors){

      console.error("SAVE ATTRIBUTE ERROR", errors);

      vm.$mdToast.show(
        vm.$mdToast.simple()
          .textContent('Attribute not saved. There was an error.')
          .position('top right')
          .theme('error-toast')
          .parent(vm.$element)
      );

      vm.busy = false;
      return errors;
    });

    return promise;
  }

  delete() {
    let vm = this;
    let defered = vm.$q.defer();

    if(vm.isNew()) {
      defered.reject('can\'t delete unsaved field.');
      return defered.promise;
    }

    return vm.AttributeRepository.delete(vm.model);
  }
}

AttributeEditorController.$inject = [
  'EditorRegistry',
  'AttributeRepository',
  'fieldTypes',
  'fieldSelection',
  '$mdToast',
  '$attrs', 
  '$element', 
  '$scope',
  '$rootScope',
  '$state',
  '$q', 
  '$timeout',
  '$compile'
];
