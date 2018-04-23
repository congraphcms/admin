
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class AttributeFormController {
  constructor(
    attributeModel, 
    contentModel, 
    attributeSet, 
    attributes, 
    EditorRegistry, 
    fieldTypes, 
    $scope, 
    $rootScope, 
    $state, 
    $mdDialog, 
    $q, 
    $timeout
  ) {
    /* jshint validthis: true */
    let vm = this;

    
    vm.model = attributeModel; // model
    vm.EditorRegistry = EditorRegistry; // editor registry
    vm.fieldTypes = fieldTypes;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$mdDialog = $mdDialog;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.contentModel = contentModel;
    vm.attributeSet = attributeSet;
    vm.attributes = attributes;
    
    vm.init();
    
  }

  init() {
    let vm = this;

    vm.optionsMenuItems = vm.getOptionsMenuItems();

    let rmEvent = vm.$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 

    });

    vm.EditorRegistry.when(vm.model).then(function(editor){
      vm.editor = editor;
    });

    // vm.$scope.$watch('vm.editor.busy', function(value){
    //   if()
    // });

    vm.$scope.$on("$destroy", rmEvent);
  }

  isNew() {
    return this.model.isNew();
  }

  isNested() {
    return !this.$state.is('app.attributes.edit') && !this.$state.is('app.attributes.new');
  }

  getOptionsMenuItems() {
    let vm = this;

    let menuNew = [
      {
        label: 'Change field type',
        icon: 'compare_arrows',
        disabled: function() {
          return !vm.canChangeFieldType();
        },
        action: function() {
          vm.changeFieldType();
        }
      },
      {
        label: 'Discard',
        icon: 'cancel',
        action: function(ev) {
          vm.discard(ev);
        }
      }
    ];

    let menuEdit = [
      {
        label: 'Duplicate',
        icon: 'content_copy',
        disabled: function() {
          return true;
        },
        action: function() {
          vm.duplicate();
        }
      },
      { 
        divider: true 
      }, 
      {
        label: 'Delete',
        icon: 'delete',
        action: function(ev) {
          vm.delete(ev);
        }
      }
    ];

    let menuShared = [
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

    Array.prototype.push.apply(menuNew, menuShared);
    Array.prototype.push.apply(menuEdit, menuShared);

    return vm.isNew() ? menuNew : menuEdit;
  }

  canChangeFieldType() {
    return this.model.isNew() && !_.isEmpty(this.model.attributes.field_type);
  }

  canSave() {
    let editor = this.EditorRegistry.get(this.model);
    return ! _.isEmpty(this.model.attributes.field_type) && editor && ! editor.busy;
  }

  changeFieldType() {
    this.model.attributes.field_type = undefined;
    let editor = this.EditorRegistry.get(this.model);
    editor.goToStep(1);
  }

  save() {
    let vm = this;
    let isNew = vm.isNew();

    let editor = vm.EditorRegistry.get(vm.model);
    editor.save().then(function(data){

      vm.$rootScope.$broadcast('attributeSaved', data);
      
      if(isNew) {
        vm.attributes.push(data);
      }

      if(vm.isNested()) {
        vm.model = data;
        vm.optionsMenuItems = vm.getOptionsMenuItems();
        vm.editor = vm.EditorRegistry.get(vm.model);
        vm.editor.deregister();
        vm.$state.go('^');
      } else {
        vm.model = data;
        vm.optionsMenuItems = vm.getOptionsMenuItems();
        vm.editor = vm.EditorRegistry.get(vm.model);
        
        if(isNew) {
          vm.editor.deregister();
          vm.$state.go('app.attributes.edit', {id: data.id});
        }
      }
      
      // vm.$state.go('app.attributeEdit', {id: fieldId});
    }, function(errors){
      console.error("ERROR PROCESSING ATTRIBUTE:", errors);
    });
  }

  duplicate() {
    let vm = this;
  }

  delete(ev) {
    let vm = this;

    vm.deleteDialog().then(function() {
      let editor = vm.EditorRegistry.get(vm.model);
      editor.delete().then(function(result){
        editor.deregister();
        vm.$rootScope.$broadcast('attributeDeleted', vm.model);
        vm.$state.go('^');
      }, function(result){

      });
    });
  }

  discard(ev) {
    let vm = this;
    let editor = vm.EditorRegistry.get(vm.model);
    if(editor.form.$pristine) {
      editor.deregister();
      vm.$state.go('^');
      return;
    }

    vm.discardDialog().then(function() {
      editor.deregister();
      vm.$state.go('^');
    }, function() {
      
    });
  }

  deleteDialog(ev) {
    let vm = this;

    let confirmDeleteDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Delete this field?')
          .textContent('Do you really want to delete the field?')
          .ariaLabel('Delete field dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDeleteDialog);
  }

  discardDialog(ev) {
    let vm = this;
    let title = (vm.model.isNew())?'Discard attribute?':'Discard changes?';
    let text = (vm.model.isNew())?'Do you really want to discard the attribute?':'Do you really want to discard the changes?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Discard field dialog')
          .targetEvent(ev)
          .ok('Discard')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }

}

AttributeFormController.$inject = [
  'attributeModel',
  'contentModel',
  'attributeSet',
  'attributes',
  'EditorRegistry',
  'fieldTypes',
  '$scope',
  '$rootScope',
  '$state',
  '$mdDialog',
  '$q', 
  '$timeout'
];
