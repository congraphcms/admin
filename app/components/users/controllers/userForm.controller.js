
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class UserFormController {
  constructor(
    userModel,
    roles, 
    EditorRegistry, 
    $scope, 
    $rootScope, 
    $state, 
    $mdDialog, 
    $q, 
    $timeout
  ) {

    /* jshint validthis: true */
    let vm = this;
    
    vm.model = userModel; // model
    vm.roles = roles;
    vm.EditorRegistry = EditorRegistry; // editor registry

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$mdDialog = $mdDialog;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.init();
    
  }

  init () {
    let vm = this;

    vm.optionsMenuItems = vm.getOptionsMenuItems();

    vm.EditorRegistry.when(vm.model).then(function(editor){
      vm.editor = editor;
    });

  }

  isNew() {
    return this.model.isNew();
  }

  getOptionsMenuItems() {
    let vm = this;

    let menuNew = [
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

  stateActive() {
    return this.$state.is('app.users.new') || this.$state.is('app.users.edit');
  }

  canSave() {
    let editor = this.EditorRegistry.get(this.model);
    return editor && ! editor.busy;
  }

  save() {
    let vm = this;
    let isNew = vm.isNew();
    let editor = vm.EditorRegistry.get(vm.model);
    editor.save().then(function(data){
      vm.$rootScope.$broadcast('userSaved', data);
      vm.model = data;
      vm.optionsMenuItems = vm.getOptionsMenuItems();
      vm.editor = vm.EditorRegistry.get(vm.model);
      
      if(isNew){
        vm.editor.deregister();
        vm.$state.go('app.users.edit', {id: data.id});
      }
      
    }, function(errors){

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
        vm.$rootScope.$broadcast('userDeleted', vm.model);
        editor.deregister();
        vm.$state.go('app.users');
      }, function(result){
        console.warn('Delete failed there should be notification to user in this case.');
      });
    });
  }

  discard(ev) {
    let vm = this;
    let editor = vm.EditorRegistry.get(vm.model);
    if(editor.form.$pristine) {
      editor.deregister();
      vm.$state.go('app.users');
      return;
    }

    vm.discardDialog().then(function() {
      editor.deregister();
      vm.$state.go('app.users');
    }, function() {

    });
  }

  deleteDialog(ev) {
    let vm = this;

    let confirmDeleteDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title('Delete this user?')
          .textContent('This user will not be able to login once deleted. Do you really want to delete this user?')
          .ariaLabel('Delete user dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDeleteDialog);
  }

  discardDialog(ev) {
    let vm = this;
    let title = (vm.model.isNew())?'Discard user?':'Discard changes?';
    let text = (vm.model.isNew())?'Do you really want to discard the user?':'Do you really want to discard the changes?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Discard user dialog')
          .targetEvent(ev)
          .ok('Discard')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }
}

UserFormController.$inject = [
  'userModel',
  'roles',
  'EditorRegistry',
  '$scope',
  '$rootScope',
  '$state',
  '$mdDialog',
  '$q', 
  '$timeout'
];
