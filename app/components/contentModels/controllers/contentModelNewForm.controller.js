
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class ContentModelNewFormController {
  constructor(
    contentModel,
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
    
    vm.model = contentModel; // model
    vm.EditorRegistry = EditorRegistry; // editor registry

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

    vm.editor = vm.EditorRegistry.get(vm.model);

    vm.optionsMenuItems = vm.getOptionsMenuItems();
  }


  getOptionsMenuItems() {
    let vm = this;

    let menu = [
      {
        label: 'Discard',
        icon: 'cancel',
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

    let editor = vm.EditorRegistry.get(vm.model);
    editor.save().then(function(data){

      // vm.model = data;
      // vm.optionsMenuItems = vm.getOptionsMenuItems();
      // vm.editor = vm.EditorRegistry.get(vm.model);
      vm.$rootScope.$broadcast('cb.entityTypes.refresh');
      vm.$state.go('app.contentModels.detail', {id: data.id});
      // vm.$state.go('app.attributeEdit', {id: fieldId});
    }, function(errors){

    });
  }

  discard(ev) {
    let vm = this;
    let editor = vm.EditorRegistry.get(vm.model);
    if(editor.form.$pristine) {
      vm.$state.go('app.contentModels');
      return;
    }

    vm.discardDialog().then(function() {
      vm.$state.go('app.contentModels');
    }, function() {

    });
  }

  discardDialog(ev) {
    let vm = this;
    let title = (vm.model.isNew())?'Discard content model?':'Discard changes?';
    let text = (vm.model.isNew())?'Do you really want to discard the content model?':'Do you really want to discard the changes?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Discard content model dialog')
          .targetEvent(ev)
          .ok('Discard')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }
}


ContentModelNewFormController.$inject = [
  'contentModel',
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