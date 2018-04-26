
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class UserEditorController {
  constructor(
    EditorRegistry,
    UserRepository,
    RoleCollection,
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

    vm.EditorRegistry = EditorRegistry;

    vm.UserRepository = UserRepository;
    vm.RoleCollection = RoleCollection;

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

  }

  toggleRole(role) {
    let vm = this;
    let userRoles = vm.model.attributes.roles;

    if(userRoles.length == 0) {
      vm.model.attributes.roles = new vm.RoleCollection();
      userRoles = vm.model.attributes.roles;
    }

    let userRole = userRoles.findWhere({id: role.id});

    if(!userRole) {
      vm.model.attributes.roles.push(role);
    } else {
      vm.model.attributes.roles.remove(userRole);
    }
  }

  userHasRole(role) {
    let vm = this;
    let userRoles = vm.model.attributes.roles;
    if(! (userRoles instanceof vm.RoleCollection)) {
      vm.model.attributes.roles = new vm.RoleCollection();
      userRoles = vm.model.attributes.roles;
    }

    return !!userRoles.findWhere({id: role.id});
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

    let promise = vm.UserRepository.save(vm.model);

    promise.then(function(result){

      vm.deregister();
      vm.deregister = vm.EditorRegistry.register(vm, result);
      // vm.model = result;

      vm.busy = false;
      vm.form.$setDirty(false);
      vm.form.$setPristine(true);

      vm.$mdToast.show(
        vm.$mdToast.simple()
          .textContent('User successfully saved.')
          .position('top right')
          .theme('success-toast')
          .parent(vm.$element)
      );


      return result;

    }, function(errors){
      console.error("SAVE USER ERROR", errors);

      vm.$mdToast.show(
        vm.$mdToast.simple()
          .textContent('User not saved. There was an error.')
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

    return vm.UserRepository.delete(vm.model);
  }
}

UserEditorController.$inject = [
  'EditorRegistry',
  'UserRepository',
  'RoleCollection',
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
