
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class UserPasswordEditorController {
  constructor(
    EditorRegistry, 
    UserRepository, 
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

    vm.form = $element.controller('form');

    vm.$attrs = $attrs;
    vm.$element = $element;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$q = $q;
    vm.$timeout = $timeout;
    vm.$compile = $compile;

    vm.EditorRegistry = EditorRegistry;

    vm.UserRepository = UserRepository;

    vm.init();
  }

  init() {
    let vm = this;
    vm.newPassword = '';
    vm.deregister = vm.EditorRegistry.register(this, vm.model.id+'pass');

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

    let promise = vm.UserRepository.changePassword(vm.model.id, vm.newPassword);

    promise.then(function(result){

      vm.deregister();
      // vm.model = result;

      vm.busy = false;
      vm.form.$setDirty(false);
      vm.form.$setPristine(true);
      return result;

    }, function(errors){
      console.error("SAVE USER PASSWORD ERROR", errors);

      vm.busy = false;

      return errors;
    });

    return promise;
  }
}

UserPasswordEditorController.$inject = [
  'EditorRegistry',
  'UserRepository',
  '$attrs', 
  '$element', 
  '$scope',
  '$rootScope',
  '$state',
  '$q', 
  '$timeout',
  '$compile'
];
