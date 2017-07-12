
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class ContentModelListController {
  constructor(
    EntityTypeRepository, 
    $mdSidenav,
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

    vm.EntityTypeRepository = EntityTypeRepository;

    vm.$mdDialog = $mdDialog;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$stateParams = $stateParams;
    vm.$element = $element;
    vm.$mdSidenav = $mdSidenav;
    vm.$q = $q;
    vm.$timeout = $timeout;
    
    vm.init();
  }

  init() {
    let vm = this;

    // entity types colection 
    vm.entityTypesCollection = null;

    // model array from collection
    vm.list = [];

    vm.ready = false;
    vm.empty = true;

    vm.busyModels = [];

    vm.infoOpenLocked = false;

    vm.getList();

    vm.selectedModel = null;

    vm.currentFilter = null;
    // sort menu 
    vm.sortOptions = [
      {
        'sort': 'name',
        'label': 'Name'
      },
      {
        'sort': 'updated_at',
        'label': 'Last modified'
      },
      {
        'sort': 'created_at',
        'label': 'Last created'
      }
    ];
    vm.sortOption = vm.sortOptions[0];
    vm.setSortOption = function(option) {
        vm.sortOption = option;
        vm.applySort();
        vm.filterList(vm.currentFilter);
    };
    // sort menu 
    vm.openSortMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    vm.booleanToText = function(value) {
      return !!value ? 'Yes' : 'No';
    }
  }

  getList() {
    let vm = this;

    vm.getEntityTypes().then(function(results){
      // store collection
      vm.entityTypesCollection = results;
      vm.applySort();
      // optionaly change collection (filter, sort etc)
      vm.list = vm.entityTypesCollection.models;

      if(vm.detailState()) {
        let id = parseInt(vm.$state.params.id);
        vm.selectedModel = vm.entityTypesCollection.findWhere({id: id});
      }

      // set listing flags
      vm.ready = true;
      vm.empty = !results.length; 
    }); 
  }

  detailState() {
    return this.$state.is('app.contentModels.detail');
  }

  selectModel(event, item) {
    let vm = this;
    vm.selectedModel = item;
  }

  unselectModel() {
    this.selectedModel = null;
  }

  viewContentModel(model) {
    let vm = this;
    
    if(vm.selectedModel == model) {
      return;
    }
    
    vm.selectedModel = model;
    
    if(vm.detailState()){
      vm.$state.go('^.detail', {id: model.id});
      return;
    }

    vm.$state.go('.detail', {id: model.id});
  }

  filterList(selection) {
    let vm = this;
    vm.currentFilter = selection;
    if(!selection) {
      let filtered = vm.entityTypesCollection.where(null);
      vm.list = filtered;
      return
    }

    let params = {};
    let values = [];
    
    vm.list = filtered;
    return;
  }


  applySort() {
    let vm = this;
    vm.entityTypesCollection.comparator = vm.sortOption.sort;
    vm.entityTypesCollection.sort();
  }

  filterList(params) {
    let vm = this;
    let filtered = vm.entityTypesCollection.where(params);
    vm.list = filtered;
  }

  getEntityTypes() {
    return this.EntityTypeRepository.get();
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

  deleteContentModel(model) {
    let vm = this;

    vm.deleteContentModelDialog().then(function() {
      vm.addBusyModel(model);
      vm.EntityTypeRepository.delete(model).then(function(result){
        vm.entityTypesCollection.remove(model);
        vm.applySort();
        // optionaly change collection (filter, sort etc) 
        vm.list = vm.entityTypesCollection.models;
        vm.removeBusyModel(model);
        if(vm.$state.is('app.contentModels.detail')) {
          vm.$state.go('^');
        }
      });
    }, function() {

    });
  }

  deleteContentModelDialog(ev) {
    let vm = this;
    let title = 'Delete content model?';
    let text = 'This will result in lost of all data that is related to this content model. Do you really want to delete this content model?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete content model dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }

}
ContentModelListController.$inject = [
  'EntityTypeRepository',
  '$mdSidenav',
  '$mdDialog',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$element',
  '$q', 
  '$timeout'
];