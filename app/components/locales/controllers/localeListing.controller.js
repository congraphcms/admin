
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class LocaleListingController {
  constructor(
    LocaleRepository, 
    AppSettings, 
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

    vm.LocaleRepository = LocaleRepository;
    vm.AppSettings = AppSettings;
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
    vm.localesCollection = null;

    // model array from collection
    vm.list = [];

    vm.ready = false;
    vm.empty = true;
    vm.selectedField = null;
    vm.busyModels = [];

    vm.getList();

    function localeChangeHandler(ev, model) {
      vm.resetList();
    }
    vm.$scope.$on('localeDeleted', localeChangeHandler);
    vm.$scope.$on('localeSaved', localeChangeHandler);

  }

  getList() {
    let vm = this;

    vm.getLocales().then(function(results){
      // store collection
      vm.localesCollection  = results;
      // optionaly change collection (filter, sort etc) 
      vm.list = vm.localesCollection.models;
      
      // set listing flags
      vm.ready = true;
      vm.empty = !results.length;
    });
  }

  resetList() {
    let vm = this;

    vm.ready = false;
    vm.empty = true;
    vm.localesCollection = null;
    vm.list = [];
    vm.selectedField = null;

    vm.getList();
  }

  editField(fieldId) {
    let vm = this;
    vm.$state.go('.edit', {id: fieldId});
  }


  getLocales() {
    return this.LocaleRepository.get();
  }

  deleteLocale(locale) {
    let vm = this;
    vm.LocaleRepository.delete(locale).then(
      function(result){
        vm.localesCollection.remove(locale);
        // optionaly change collection (filter, sort etc) 
        vm.list = vm.localesCollection.models;
      }, function(errors){
        throw new Error('Failed to delete locale.');
      }
    );
  }

  defaultLocale(locale) {
    return locale.id == parseInt(this.AppSettings.APP.DEFAULT_LOCALE);
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

  deleteLocale(model) {
    let vm = this;

    vm.deleteLocaleDialog().then(function() {
      vm.addBusyModel(model);

      vm.LocaleRepository.delete(model).then(
        function(result){
          vm.localesCollection.remove(model);
          // optionaly change collection (filter, sort etc) 
          vm.list = vm.localesCollection.models;
          vm.removeBusyModel(model);
        }, function(errors){
          throw new Error('Failed to delete locale.');
        }
      );

    }, function() {

    });
  }

  deleteLocaleDialog(ev) {
    let vm = this;
    let title = 'Delete locale?';
    let text = 'This will result in lost of all data that is related to this locale. Do you really want to delete this locale?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete locale dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }

  isListing() {
    return this.$state.is('app.locales');
  }
}

LocaleListingController.$inject = [
  'LocaleRepository', 
  'AppSettings', 
  '$mdDialog', 
  '$scope', 
  '$rootScope', 
  '$state', 
  '$stateParams', 
  '$element', 
  '$q', 
  '$timeout'
];
