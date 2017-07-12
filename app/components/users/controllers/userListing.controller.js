
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class UserListingController {
  constructor(
    UserRepository, 
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

    vm.UserRepository = UserRepository;
    vm.$mdDialog = $mdDialog;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$element = $element;
    vm.$q = $q;
    vm.$timeout = $timeout;

    vm.init();
  }

  init() {
    let vm = this;

    // locales colection 
    vm.usersCollection = null;

    // model array from collection
    vm.list = [];

    vm.ready = false;
    vm.empty = true;
    vm.selectedUser = null;
    vm.busyModels = [];

    vm.getList();

    function userChangeHandler(ev, model) {
      vm.resetList();
    }
    vm.$scope.$on('userDeleted', userChangeHandler);
    vm.$scope.$on('userSaved', userChangeHandler);

  }

  getList() {
    let vm = this;

    vm.getUsers().then(function(results){
      // store collection
      vm.usersCollection  = results;
      // optionaly change collection (filter, sort etc) 
      vm.list = vm.usersCollection.models;
      
      // set listing flags
      vm.ready = true;
      vm.empty = !results.length;
    });
  }

  resetList() {
    let vm = this;

    vm.ready = false;
    vm.empty = true;
    vm.usersCollection = null;
    vm.list = [];
    vm.selectedField = null;

    vm.getList();
  }

  editUser(userId) {
    let vm = this;
    vm.$state.go('app.users.edit', {id: userId});
  }


  getUsers() {
    return this.UserRepository.get();
  }

  modelBusy(model) {
    let vm = this;
    return _.indexOf(vm.busyModels, model.id) != -1;
  }

  addBusyModel(model) {
    let vm = this;
    if(_.indexOf(vm.busyModels, model.id) == -1) {
      vm.busyModels.push(model.id);
    }
  }

  removeBusyModel(model) {
    let vm = this;
    let index = _.indexOf(vm.busyModels, model.id);
    if(index != -1) {
      vm.busyModels.splice(index, 1);
    }
  }

  deleteUser(model) {
    let vm = this;

    vm.deleteUserDialog().then(function() {
      vm.addBusyModel(model);

      vm.UserRepository.delete(model).then(
        function(result){
          vm.usersCollection.remove(model);
          // optionaly change collection (filter, sort etc) 
          vm.list = vm.usersCollection.models;
          vm.removeBusyModel(model);
        }, function(errors){
          throw new Error('Failed to delete user.');
        }
      );

    }, function() {

    });
  }

  deleteUserDialog(ev) {
    let vm = this;
    let title = 'Delete user?';
    let text = 'This user will not be able to login once deleted. Do you really want to delete this user?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete user dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }

  isListing() {
    return this.$state.is('app.users');
  }
}

UserListingController.$inject = [
  'UserRepository',
  '$mdDialog',
  '$scope',
  '$rootScope',
  '$state',
  '$element',
  '$q', 
  '$timeout'
];
