
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';
import FileFormController from './fileForm.controller.js'
import fileFormTemplate from './../views/fileForm.tmpl.html'

export default class MediaListingController {
  constructor(
    FileRepository, 
    $sce, 
    $mdSidenav,
    $mdDialog, 
    $mdMedia, 
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

    vm.FileRepository = FileRepository;
    vm.$sce = $sce;
    vm.$mdSidenav = $mdSidenav;
    vm.$mdDialog = $mdDialog;
    vm.$mdMedia = $mdMedia;
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

    // test
    vm.imagePath = 'http://cbdev.dev/api/delivery/files/9789.jpg?v=admin_image'

    // entity types colection 
    vm.filesCollection = null;

    // model array from collection
    vm.list = [];
    vm.currentFilter = null;

    vm.ready = false;
    vm.empty = true;
    vm.selectedModel = null;
    vm.busyModels = [];

    vm.getList();

    // sort menu 
    vm.sortOptions = [
      {
        'sort': 'name',
        'label': 'Name'
      },
      {
        'sort': 'size',
        'label': 'Size'
      },
      {
        'sort': 'extension',
        'label': 'Type'
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

    function fileChangeHandler(ev, model) {
      vm.resetList();
    }
    vm.$scope.$on('fileDeleted', fileChangeHandler);
    vm.$scope.$on('fileSaved', fileChangeHandler);

    vm.filtersOpened = vm.$mdMedia('gt-sm');
  }

  getList() {
    let vm = this;

    vm.getFiles().then(function(results){
      // store collection
      vm.filesCollection  = results;
      vm.applySort();
      // optionaly change collection (filter, sort etc) 
      vm.list = vm.filesCollection.models;

      vm.filesCollection.each(function(file){
        if(!file.isImage()) return;

        let img = new Image();
        img.onload = function() {
          vm.$scope.$apply(function(){
            file.isLoaded = true;
          });
        };

        img.src = file.getAdminImageUrl();
      });
      // set listing flags
      vm.ready = true;
      vm.empty = !results.length;
    });
  }

  resetList() {
    let vm = this;

    vm.ready = false;
    vm.empty = true;
    vm.filesCollection = null;
    vm.list = [];
    vm.selectedModel = null;

    vm.getList();
  }

  selectModel(item, event) {
    let vm = this;
    console.log(event)
    vm.selectedModel = item;
  }

  removeSelection() {
    this.selectedModel  = null;
  }

  editFile(file, event) {
    if(event) {
      event.stopPropagation();
    }
    
    var vm = this;

    vm.$mdDialog.show({
      controller: FileFormController,
      controllerAs: 'fc',
      template: fileFormTemplate,
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true,
      bindToController: true,
      locals: {
        fileModel: file
      }
    })
    .then(function(newFile) {
      // vm.filesCollection.add(newDocument);
    });
  }

  uploadDocument(event) {
    
  }

  filterList(selection) {
    let vm = this;
    vm.currentFilter = selection;
    if(!selection) {
      let filtered = vm.filesCollection.where(null);
      vm.list = filtered;
      return;
    }

    let params = {};
    params.field_type = selection.value;
    let filtered = vm.filesCollection.where(params);
    vm.list = filtered;
    return;
  }

  applySort() {
    let vm = this;
    vm.filesCollection.comparator = vm.sortOption.sort;
    vm.filesCollection.sort();
  };

  getFiles() {
    return this.FileRepository.get();
  }

  deleteFile(file, event) {
    if(event) {
      event.stopPropagation();
    }
    let vm = this;
    vm.FileRepository.delete(file).then(
      function(result){
        vm.filesCollection.remove(file);
        vm.applySort();
        // optionaly change collection (filter, sort etc) 
        vm.list = vm.filesCollection.models;
      }, function(errors){
        throw new Error('Failed to delete file.');
      }
    );
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

  deleteFile(model) {
    let vm = this;

    vm.deleteFileDialog().then(function() {
      vm.addBusyModel(model);

      vm.FileRepository.delete(model).then(
        function(result){
          vm.filesCollection.remove(model);
          vm.applySort();
          // optionaly change collection (filter, sort etc) 
          vm.list = vm.filesCollection.models;
          vm.removeBusyModel(model);
          if(vm.selectedModel == model) {
            vm.selectedModel = null;
          }
        }, function(errors){
          throw new Error('Failed to delete file.');
        }
      );
    }, function() {

    });
  }

  deleteFileDialog(ev) {
    let vm = this;
    let title = 'Delete file?';
    let text = 'Do you really want to delete this file?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete file dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }


  isListing() {
    return this.$state.is('app.media');
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

  trustSrc(src) {
    return this.$sce.trustAsResourceUrl(src);
  }
}

MediaListingController.$inject = [
  'FileRepository',
  '$sce', 
  '$mdSidenav',
  '$mdDialog',
  '$mdMedia', 
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$element',
  '$q', 
  '$timeout'
];

