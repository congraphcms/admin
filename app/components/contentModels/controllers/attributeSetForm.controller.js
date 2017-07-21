import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class AttributeSetFormController {
  constructor(
    contentModel, 
    attributeSet,
    attributes, 
    EditorRegistry, 
    $mdDialog, 
    $scope, 
    $rootScope, 
    $state, 
    $stateParams, 
    $element,
    $q, 
    $timeout
  ) {

    /* jshint validthis: true */
    let vm = this;
    
    vm.contentModel = contentModel;
    vm.attributeSet = attributeSet; // model
    vm.model = attributeSet.clone();
    vm.EditorRegistry = EditorRegistry; // editor registry
    vm.attributesCollection = attributes;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$mdDialog = $mdDialog;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.init();
  }

  init() {
    let vm = this;
    vm.model.set('entity_type_id', vm.contentModel.id);
    vm.editor = vm.EditorRegistry.get(vm.model);

    vm.optionsMenuItems = vm.getOptionsMenuItems();
  }

  isNew() {
    return this.model.isNew();
  }

  stateActive() {
    return this.$state.is('app.contentModelAttributeSet');
  }

  getOptionsMenuItems() {
    let vm = this;

    let menu = [
      {
        label: 'Discard changes',
        icon: 'cancel',
        disabled: function() {
          vm.editor = vm.EditorRegistry.get(vm.model);
          return vm.editor && vm.editor.form.$pristine;
        },
        action: function(ev) {
          vm.discard(ev);
        }
      },
      { 
        divider: true 
      }, 
      {
        label: 'Help',
        icon: 'help',
        disabled: function() {
          return true;
        },
        action: angular.noop
      }
    ];

    return menu;
  }

  canSave() {
    let editor = this.EditorRegistry.get(this.model);
    return editor && ! editor.busy && editor.form.$valid;
  }

  save() {
    let vm = this;
    let isNew = vm.model.isNew();
    let editor = vm.EditorRegistry.get(vm.model);
    editor.save().then(function(data){

      if(isNew) {
        vm.model.set({id: data.id});
        vm.contentModel.attributes.attribute_sets.push(vm.model);
        // vm.$scope.$apply();
      } else {
        let replaceData = vm.model.getData({nestIncluded: true, include: 'name, code, primary_attribute_id, attributes'});
        vm.attributeSet.set(replaceData);
      }

      vm.$rootScope.$broadcast('cb.entityTypes.refresh');
      editor.deregister();
      vm.$state.go('app.contentModels.detail', {id: vm.contentModel.id});
    }, function(errors){

    });
  }

  discard(ev) {
    let vm = this;
    let editor = vm.EditorRegistry.get(vm.model);
    if(editor.form.$pristine) {
      editor.deregister();
      vm.$state.go('app.contentModels.detail', {id: vm.contentModel.id});
      return;
    }

    vm.discardDialog().then(function() {
      editor.deregister();
      vm.$state.go('app.contentModels.detail', {id: vm.contentModel.id});
    }, function() {

    });
  }

  discardDialog(ev) {
    let vm = this;
    let title = 'Discard changes?';
    let text = 'Do you really want to discard the changes?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Discard changes dialog')
          .targetEvent(ev)
          .ok('Discard')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }
}

AttributeSetFormController.$inject = [
  'contentModel', 
  'attributeSet',
  'attributes', 
  'EditorRegistry', 
  '$mdDialog', 
  '$scope', 
  '$rootScope', 
  '$state', 
  '$stateParams', 
  '$element',
  '$q', 
  '$timeout'
];
