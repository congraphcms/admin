
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class AttributeListingController {
  constructor(
    AttributeRepository, 
    fieldSelection, 
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

    vm.AttributeRepository = AttributeRepository;
    vm.fieldSelection = fieldSelection;
    vm.$mdSidenav = $mdSidenav;
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

    // entity types colection 
    vm.attributesCollection = null;

    // model array from collection
    vm.list = [];
    vm.currentFilter = null;

    vm.ready = false;
    vm.empty = true;
    vm.selectedField = null;
    vm.busyModels = [];

    vm.getList();

    // sort menu 
    vm.sortOptions = [
      {
        'sort': 'admin_label',
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
    vm.openSortMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };
    vm.booleanToText = function(value) {
      if(!!value) {
        return 'Yes';
      }

      return 'No';
    }

    vm.$scope.$watch('vm.selectedField', function(value){
      if(value != null) {
        vm.$mdSidenav('info-sidenav').open();
      }
    });

    function attributeChangeHandler(ev, model) {
      vm.resetList();
    }
    vm.$scope.$on('attributeDeleted', attributeChangeHandler);
    vm.$scope.$on('attributeSaved', attributeChangeHandler);
  }

  getList() {
    let vm = this;

    vm.getAttributes().then(function(results){
      // store collection
      vm.attributesCollection  = results;
      vm.applySort();
      // optionaly change collection (filter, sort etc) 
      vm.list = vm.attributesCollection.models;
      
      vm.selectedField = vm.list[0];
      // set listing flags
      vm.ready = true;
      vm.empty = !results.length;
    });
  }

  resetList() {
    let vm = this;

    vm.ready = false;
    vm.empty = true;
    vm.attributesCollection = null;
    vm.list = [];
    vm.selectedField = null;

    vm.getList();
  }

  getFieldTypeIcon(fieldType) {
    let vm = this,
        defaultIcon = '';
    if (_.isUndefined(fieldType) || !_.has(vm.fieldTypes, fieldType)) {
      return defaultIcon;
    }
    let type = vm.fieldTypes[fieldType];
    if (!_.has(type, 'icon')) {
      return defaultIcon;
    }
    return type.icon;
  }

  selectField(event, item) {
    let vm = this;
    vm.selectedField = item;
  }

  unselectField() {
    this.selectedField = null;
  }

  editField(fieldId) {
    let vm = this;
    vm.$state.go('app.attributes.edit', {id: fieldId});
  }

  filterList(selection) {
    let vm = this;
    vm.currentFilter = selection;
    if(!selection) {
      let filtered = vm.attributesCollection.where(null);
      vm.list = filtered;
      return
    }

    let params = {};
    if( ! selection.sub_choices ) {
      params.field_type = selection.value;
      let filtered = vm.attributesCollection.where(params);
      vm.list = filtered;
      return
    }

    let values = [];
    _.each(selection.sub_choices, function(subChoice){
      values.push(subChoice.value);
    });

    let filtered = vm.attributesCollection.filter(function(model){
      if(_.indexOf(values, model.get('field_type')) > -1){
        return 1;
      }

      return 0;
    }, vm);
    
    vm.list = filtered;
    return;
  }


  applySort() {
    let vm = this;
    vm.attributesCollection.comparator = vm.sortOption.sort;
    vm.attributesCollection.sort();
  };

  getAttributes() {
    return this.AttributeRepository.get();
  }

  deleteAttribute(attribute) {
    let vm = this;
    vm.AttributeRepository.delete(attribute).then(
      function(result){
        vm.attributesCollection.remove(attribute);
        vm.applySort();
        // optionaly change collection (filter, sort etc) 
        vm.list = vm.attributesCollection.models;
      }, function(errors){
        throw new Error('Failed to delete attribute.');
      }
    );
  }

  getAttributeIcon(model) {
    if(!model){
      return '';
    }
    let icon = '';
    _.each(this.fieldSelection, function(selection){
      if( ! selection.sub_choices ) {
        if(selection.value == model.get('field_type')) {
          icon = selection.icon;
        }
        return;
      }

      _.each(selection.sub_choices, function(subChoice){
        if(subChoice.value == model.get("field_type")){
          icon = selection.icon;
          return;
        }
      });
    });

    return icon; 
  }

  getAttributeType(model) {
    if(!model){
      return '';
    }
    let type = '';
    _.each(this.fieldSelection, function(selection){
      if( ! selection.sub_choices ) {
        if(selection.value == model.get('field_type')) {
          type = selection.label;
        }
        return;
      }

      _.each(selection.sub_choices, function(subChoice){
        if(subChoice.value == model.get("field_type")){
          type = selection.label;
          return;
        }
      });
    });

    return type;
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

  deleteAttribute(model) {
    let vm = this;

    vm.deleteAttributeDialog().then(function() {
      vm.addBusyModel(model);

      vm.AttributeRepository.delete(model).then(
        function(result){
          vm.attributesCollection.remove(model);
          vm.applySort();
          // optionaly change collection (filter, sort etc) 
          vm.list = vm.attributesCollection.models;
          vm.removeBusyModel(model);
        }, function(errors){
          throw new Error('Failed to delete attribute.');
        }
      );
    }, function() {

    });
  }

  deleteAttributeDialog(ev) {
    let vm = this;
    let title = 'Delete attribute?';
    let text = 'This will result in lost of all data that is related to this attribute. Do you really want to delete this attribute?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete attribute dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }


  isListing() {
    return this.$state.is('app.attributes');
  }
}

AttributeListingController.$inject = [
  'AttributeRepository',
  'fieldSelection',
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

