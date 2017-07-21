
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class UserPasswordFormController {
  constructor(
    userModel,
    EditorRegistry, 
    $scope, 
    $rootScope, 
    $state, 
    $q, 
    $timeout
  ) {

    /* jshint validthis: true */
    let vm = this;
    
    vm.model = userModel; // model
    vm.EditorRegistry = EditorRegistry; // editor registry

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.init();
    
  }

  init() {
    let vm = this;

    vm.EditorRegistry.when(vm.model.id+'pass').then(function(editor){
      vm.editor = editor;
    });

  }

  canSave() {
    let editor = this.EditorRegistry.get(this.model.id+'pass');
    return editor && ! editor.busy;
  }

  save() {
    let vm = this;

    let editor = vm.EditorRegistry.get(vm.model.id+'pass');
    editor.save().then(function(data){
      editor.deregister();
      vm.$state.go('^', {id: vm.model.id});
      
    }, function(errors){

    });
  }

  discard(ev) {
    let vm = this;
    let editor = vm.EditorRegistry.get(vm.model.id+'pass');
    editor.deregister();
    vm.$state.go('^');
    return;
  }
}

UserPasswordFormController.$inject = [
  'userModel',
  'EditorRegistry',
  '$scope',
  '$rootScope',
  '$state',
  '$q', 
  '$timeout'
];
