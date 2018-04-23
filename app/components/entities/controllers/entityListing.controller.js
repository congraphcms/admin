
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class EntityListingController {
  constructor(
    EntityRepository, 
    contentModel, 
    attributeSets,
    attributes, 
    locales, 
    defaultLocale,
    AppSettings, 
    $mdDialog, 
    $mdMedia, 
    $scope, 
    $rootScope, 
    $state, 
    $stateParams, 
    $q, 
    $timeout
  ) {

    /* jshint validthis: true */
    let vm = this;

    vm.EntityRepository = EntityRepository;
    vm.contentModel = contentModel;
    vm.workflow = contentModel.get('workflow');
    vm.workflowPoints = vm.workflow.get('points');
    vm.attributeSets = attributeSets;
    vm.attributes = attributes;
    vm.locales = locales;
    vm.defaultLocale = defaultLocale;
    vm.AppSettings = AppSettings;

    vm.$mdDialog = $mdDialog;
    vm.$mdMedia = $mdMedia;
    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$stateParams = $stateParams;
    vm.$q = $q;
    vm.$timeout = $timeout;

    // get locale
    vm.listStatusFilter = {};
    vm.listStatusFilter = _.extend(vm.listStatusFilter, vm.filterTrashStatuses());

    vm.listFilterSelected = {
      date: null,
      status: null
    };

    vm.locale = vm.getLocale();

    vm.listFilter = {};
    vm.listSort = { sort: '-updated_at'};
    vm.searchTerms = '';
    vm.pageSize = 30;

    vm.filtersOpened = vm.$mdMedia('gt-sm');

    vm.init();

  }

  init() {
    var vm = this;

    // entities colection
    vm.entitiesCollection = null;

    // model array from collection
    vm.list = [];

    vm.ready = false;
    vm.empty = true;

    // sort menu
    vm.sortOptions = [ 
      'last_modified_sort', 
      'last_created_sort'
    ];

    vm.sortOption = 'last_modified_sort';
    
    vm.setSortOption = function(str) {
        vm.sortOption = str;
        vm.sortList();
    };

    vm.openSortMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    vm.openLocaleSelect = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
    };

    // vm.changeLocale = function(locale) {
    //   vm.$state.go('app.entities.type.list', {locale: locale.attributes.code});
    // };

    // LIST
    // ------------------------
    var DynamicItems = function() {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       */
      this.loadedPages = {};
      /** @type {number} Total number of items. */
      this.numItems = 0;
      /** @const {number} Number of items to fetch per request. */
      this.fetchPage_(0);
    };

    // Required.
    DynamicItems.prototype.getItemAtIndex = function(index) {
      var pageNumber = Math.floor(index / vm.pageSize);
      var page = this.loadedPages[pageNumber];
      if (page) {
        return page[index % vm.pageSize];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    DynamicItems.prototype.getLength = function() {
      return this.numItems;
    };

    DynamicItems.prototype.fetchPage_ = function(pageNumber) {
      var di = this;
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;
      // For demo purposes, we simulate loading more items with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      vm.getEntities(pageNumber).then(function(results){
        // store collection
        vm.entitiesCollection = results;
        di.numItems = results.meta.total;
        // optionaly change collection (filter, sort etc)
        vm.list = vm.entitiesCollection.models;
        // set listing flags
        vm.ready = true;
        vm.empty = results.meta.total == 0;

        di.loadedPages[pageNumber] = [];
        _.each(vm.entitiesCollection.models, function(item) {
          di.loadedPages[pageNumber].push(item);
        });
      });
    };

    DynamicItems.prototype.fetchNumItems_ = function() {
      // For demo purposes, we simulate loading the item count with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      vm.$timeout(angular.noop, 300).then(angular.bind(this, function() {
        this.numItems = 5000;
      }));
    };

    DynamicItems.prototype.resetItems = function() {
      vm.ready = false;
      this.numItems = 0;
      this.loadedPages = {};
      this.fetchPage_(0);
    };


    vm.dynamicItems = new DynamicItems();

    function entityChangeHandler(ev, model) {
      vm.dynamicItems.resetItems();
    }
    vm.$scope.$on('entityDeleted', entityChangeHandler);
    vm.$scope.$on('entitySaved', entityChangeHandler);

    // vm.getList();

  }

  getLocale() {
    let vm = this;
    let localeCode = vm.$stateParams.listingLocale || vm.defaultLocale.get('code');



    let locale = angular.copy(vm.locales.findWhere({code: localeCode}));

    return locale;
  }

  getList() {
    let vm = this;
    vm.ready = false;
    vm.getEntities().then(function(results){
      // store collection
      vm.entitiesCollection = results;
      // optionaly change collection (filter, sort etc)
      vm.list = vm.entitiesCollection.models;
      // set listing flags
      vm.ready = true;
      vm.empty = !results.length;
    });
  }

  getEntities(pageNumber) {
    let vm = this;

    let query = _.extend(vm.listStatusFilter, vm.listSort, {
      locale: vm.locale.get('code'),
      // status: vm.workflowPointsCollection.pluck('status')
      filter: _.extend(vm.listFilter, {
        entity_type: vm.contentModel.get('code')
      }),
      offset: (pageNumber) * vm.pageSize,
      limit: vm.pageSize
    });

    return vm.EntityRepository.get(query);
  }

  filterStatusList(filter) {
    let vm = this;

    if(!filter && vm.listStatusFilter != {}) {
      vm.listStatusFilter = {};
      vm.dynamicItems.resetItems();
      vm.listFilterSelected.status = null;
      // vm.getList();
      return;
    }

    let ignoreFilter = false;
    _.each(filter, function(item, key) {
      if(vm.listStatusFilter[key] == item) {
        ignoreFilter = true;
        return;
      }

      if(item == null) {
        delete vm.listStatusFilter[key];
        vm.listFilterSelected.status = null;
        return;
      }

      vm.listStatusFilter[key] = item;
      vm.listFilterSelected.status = item;
    });

    if(ignoreFilter) return;

    vm.dynamicItems.resetItems();
    // vm.getList();

  }

  filterDateList(date) {
    let vm = this;
    let filter = {created_at: null};

    if(!date) {
      vm.filterList(filter);
      vm.listFilterSelected.date = null;
      return;
    }

    switch(date) {
      case 'day':
        filter.created_at = {gte: moment().startOf('day').format()};
        break;
      case 'week':
        filter.created_at = {gte: moment().startOf('week').format()};
        break;
      case 'month':
        filter.created_at = {gte: moment().startOf('month').format()};
        break;
    }

    vm.listFilterSelected.date = date;

    vm.filterList(filter);

  }

  filterList(filter) {
    let vm = this;

    if(!filter && vm.listFilter != {}) {
      vm.listFilter = {};
      vm.dynamicItems.resetItems();
      // vm.getList();
      return;
    }
    let ignoreFilter = false;
    _.each(filter, function(item, key) {
      if(vm.listFilter[key] == item) {
        ignoreFilter = true;
        return;
      }

      if(item == null) {
        delete vm.listFilter[key];
        return;
      }

      vm.listFilter[key] = item;
    });

    if(ignoreFilter) return;

    vm.dynamicItems.resetItems();
    // vm.getList();

  }

  sortList() {
    let vm = this;
    let sort = {};

    switch(vm.sortOption) {
      case 'last_modified_sort' :
        sort = {sort: '-updated_at'};
        break;
      case 'last_created_sort':
        sort = {sort: '-created_at'};
        break;
    }

    vm.listSort = sort;
    vm.dynamicItems.resetItems();
    // vm.getList();
  }

  searchList() {
    let vm = this;

    if( vm.searchTerms.length < 1) {
      vm.filterList(null);
      return;
    }
    vm.filterList({s: vm.searchTerms});
  }

  filterTrashStatuses() {
    let vm = this;

    let filter = {
      status: null
    };

    _.each(vm.workflowPoints.models, function(point) {
      if(point.get('deleted')) {

        if(filter.status == null) {
          filter.status = {
            nin: point.get('status')
          };
        }else{
          filter.status.nin += ','+point.get('status');
        }
      }
    });
    
    return filter;
  }


  editEntity(model) {
    let vm = this;
    vm.$state.go('.edit', {id: model.id, locale: vm.locale.get('code')});
  }

  // viewEntity(model) {
  //   let vm = this;
  //   vm.$state.go('.detail', {id: model.id});
  // }

  hasMultipleSets() {
    let vm = this;

    if(vm.attributeSets.models.length <= 1 || !vm.contentModel.get('multiple_sets')) {
      return false;
    }

    return true;
  }

  selectModel(event, item) {
    this.selectedModel = item;
  }

  removeSelection() {
    this.selectedModel = null;
  }

  getDefaultSet() {
    let vm = this;
    let defaultSetId = null;
    if(defaultSetId = vm.contentModel.get('default_set_id')) {
      let defaultSet = vm.attributeSets.findWhere({id: defaultSetId})
      if( ! defaultSet ){
        return vm.attributeSets.models[0];
      }
      return defaultSet;
    }

    return vm.attributeSets.models[0];

    return true;
  }

  getAttributeLabel(code) {
    let vm = this;
    let attribute = vm.attributes.findWhere({code: code});
    // console.log('getAttributeLabel', attribute);
    return attribute.get('admin_label');
  }

  getDetailAttributes() {
    let vm = this;
    let invalidTypes = [
      'relation',
      'relation_collection',
      'asset',
      'asset_collection'
    ];
    if(!vm.selectedModel) {
      return [];
    }

    let attributeSet = vm.attributeSets.findWhere({id: vm.selectedModel.get('attribute_set_id')});
    let attributes = [];
    vm.attributes.each(function(item){
      let setAttributes = attributeSet.get('attributes');
      setAttributes.each(function(attr){
        if(item.id == attr.id) {
          if(_.indexOf(invalidTypes, item.field_type) == -1) {
            attributes.push(item);
          }
        }
      });
    });

    return attributes;
  }

  isListing() {
    return this.$state.is('app.entities.type');
  }

  reverseArray(array) {
    let newArray = angular.copy(array);
    return newArray.reverse();
  }

  isOpenSidenav() {
    return !!this.selectedModel;
    // return this.$mdSidenav(id).isOpen()
  }

  isLockedOpenSidenav() {
    let vm = this;
    // forced false
    if (!vm.selectedModel) {
      return false;
    }
    // only if open and screen is gt-md
    return !!vm.selectedModel && vm.$mdMedia('(min-width: 1380px)');
  }

  isOpenFilters() {
    return this.filtersOpened;
    // return this.$mdSidenav(id).isOpen()
  }

  isLockedOpenFilters() {
    let vm = this;
    // forced false
    if (!vm.filtersOpened) {
      return false;
    }
    // only if open and screen is gt-sm
    return !!vm.filtersOpened && vm.$mdMedia('gt-sm');
  }
}

EntityListingController.$inject = [
  'EntityRepository',
  'contentModel',
  'attributeSets',
  'attributes',
  'locales',
  'defaultLocale',
  'AppSettings',
  '$mdDialog',
  '$mdMedia',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q',
  '$timeout'
];

