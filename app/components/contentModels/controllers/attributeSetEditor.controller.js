import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class AttributeSetEditorController {
  constructor( 
    AttributeSetRepository,
    AttributeRepository, 
    EditorRegistry,
    fieldSelection,
    $mdDialog,
    $scope, 
    $rootScope, 
    $state, 
    $stateParams, 
    $element,
    $attrs,
    $q,
    $timeout,
    $compile
  ) {
    /* jshint validthis: true */
    let vm = this;

    vm.form = $element.controller('form');

    vm.$attrs = $attrs;
    vm.$element = $element;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$q = $q;
    vm.$timeout = $timeout;
    vm.$compile = $compile;

    vm.$mdDialog = $mdDialog;

    vm.EditorRegistry = EditorRegistry;

    vm.setAttributes = vm.model.attributes.attributes;

    vm.AttributeSetRepository = AttributeSetRepository;
    vm.AttributeRepository = AttributeRepository;

    vm.fieldSelection = fieldSelection;

    vm.init();
  }

  init() {
    let vm = this;

    vm.$scope.$watch('editor.form.$pending', function(newValue) {
      if(newValue == undefined) {
        vm.busy = false;
      } else {
        vm.busy = true;
      }
    });

    vm.deregister = vm.EditorRegistry.register(this, vm.model);
    // vm.loadingAttributes = true;
    // vm.getAttributes();
    vm.busyAttributes = [];
  }

  getAttributes() {
    let vm = this;

    this.AttributeRepository.get().then(
      function(result){
        vm.attributes = result;
        vm.loadingAttributes = false;
      }, function(errors){
        console.error("ERROR loading attributes", errors);
        throw new Error(errors);
      }
    );
  }

  getAttributeIcon(model) {
    if(!model){
      return '';
    }
    let icon = '';
    _.each(this.fieldSelection, function(selection){
      if( ! selection.sub_choices ) {
        if(selection.value == model.get('field_type')) {
          icon = selection.icon;
        }
        return;
      }

      _.each(selection.sub_choices, function(subChoice){
        if(subChoice.value == model.get("field_type")){
          icon = selection.icon;
          return;
        }
      });
    });
    return icon;
  }

  addAttributeToSet(attribute) {
    let vm = this;

    if(vm.model.attributes.attributes.length == 0) {
      vm.model.attributes.primary_attribute_id = attribute.id;
    }

    vm.model.addAttribute(attribute);
  }

  removeAttributeFromSet(attribute) {
    let vm = this;
    if(vm.model.attributes.primary_attribute_id == attribute.id) {
      if(vm.model.attributes.attributes.length > 1) {
        vm.model.attributes.primary_attribute_id = vm.model.attributes.attributes.models[0].id;
      } else {
        vm.model.attributes.primary_attribute_id = null;
      }

    }
    vm.model.removeAttribute(attribute);
  }

  setPrimaryAttribute(attribute) {
    let vm = this;
    vm.model.attributes.primary_attribute_id = attribute.id;
  }


  addAttribute() {
    let vm = this;
    vm.$state.go('.attribute', {attributeId: 'new'});
  }

  editAttribute(attribute) {
    let vm = this;
    vm.$state.go('.attribute', {attributeId: attribute.id});
  }

  attributeBusy(model) {
    let vm = this;
    return _.indexOf(vm.busyAttributes, model.id) != -1;
  }

  addBusyAttribute(model) {
    let vm = this;
    if(_.indexOf(vm.busyAttributes, model.id) == -1) {
      vm.busyAttributes.push(model.id);
    }
  }

  removeBusyAttribute(model) {
    let vm = this;
    let index = _.indexOf(vm.busyAttributes, model.id);
    if(index != -1) {
      vm.busyAttributes.splice(index, 1);
    }
  }

  deleteAttribute(attribute) {
    let vm = this;
    vm.deleteAttributeDialog().then(function() {
      vm.addBusyAttribute(attribute);
      vm.AttributeRepository.delete(attribute).then(
        function(result){
          vm.attributes.remove(attribute);
          vm.removeBusyAttribute(attribute);
          // vm.applySort();
          // optionaly change collection (filter, sort etc) 
          vm.list = vm.attributes.models;
        }, function(errors){
          vm.removeBusyAttribute(attribute);
          throw new Error('Failed to delete attribute.');
        }
      );
    }, function() {

    });
    
  }

  deleteAttributeDialog(ev) {
    let vm = this;
    let title = 'Delete attribute?';
    let text = 'This will result in lost of all data that is related to this attribute. Do you really want to delete this attribute?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete attribute dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }

  isNew() {
    return this.model.isNew();
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

    let promise = vm.AttributeSetRepository.save(vm.model);

    promise.then(function(result){


      vm.deregister();
      vm.model = result;
      vm.deregister = vm.EditorRegistry.register(vm, result);

      vm.busy = false;
      vm.form.$setDirty(false);
      vm.form.$setPristine(true);
      return result;

    }, function(errors){
      console.error("SAVE ATTRIBUTE SET ERROR", errors);

      vm.busy = false;

      return errors;
    });

    return promise;

  }
}

AttributeSetEditorController.$inject = [
  'AttributeSetRepository',
  'AttributeRepository', 
  'EditorRegistry',
  'fieldSelection',
  '$mdDialog',
  '$scope', 
  '$rootScope', 
  '$state', 
  '$stateParams', 
  '$element',
  '$attrs',
  '$q',
  '$timeout',
  '$compile'
];


