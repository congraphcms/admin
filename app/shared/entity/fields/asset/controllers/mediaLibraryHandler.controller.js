
import _ from 'underscore';

import FileFormController from './../../../../../components/media/controllers/fileForm.controller.js';
import fileFormTemplate from './../../../../../components/media/views/fileForm.tmpl.html';

export default class MediaLibraryHandlerController{

  constructor(FileRepository, AppSettings, $mdDialog, $scope, $rootScope, $state, $stateParams, $q, $timeout) {

    /* jshint validthis: true */
    var handler = this;

    handler.$mdDialog = $mdDialog;
    handler.$scope = $scope;
    handler.$rootScope = $rootScope;
    handler.$state = $state;
    handler.$stateParams = $stateParams;
    handler.$q = $q;
    handler.$timeout = $timeout;

    handler.FileRepository = FileRepository;
    // handler.cbConstants = cbConstants;
    handler.assetTypes = AppSettings.assetTypes;

    // handler.attribute = handler.$scope.attribute;
    // handler.entity = handler.$scope.entity;

    handler.init();
  }

  init() {
    var handler = this;
    
    handler.fieldCode = handler.attribute.get('code');
    handler.fieldName = handler.attribute.get('admin_label');
    handler.required = handler.attribute.get('required');
    handler.unique = handler.attribute.get('unique');
    handler.attributeData = handler.attribute.get('data');
    handler.uploaderParams = {};
    handler.uploaderActive = 0;
    
    if(handler.attributeData) {
      handler.allowedTypes = handler.attributeData.allowed_types;
      handler.allowedSizes = handler.attributeData.allowed_sizes;
      

      if(handler.allowedTypes && handler.allowedTypes.length) {
        if(!_.isObject(handler.uploaderParams.filters)){
          handler.uploaderParams.filters = {};
        }

        // handler.uploaderParams.filters.mime_types = handler.allowedTypes.join(',');
        
        handler.uploaderParams.filters.mime_types = [{
          title: 'allowed types',
          extensions: handler.getAllowedExtensions()
        }];
      }

      if(handler.allowedSizes && handler.allowedSizes.max) {
        if(!_.isObject(handler.uploaderParams.filters)){
          handler.uploaderParams.filters = {};
        }
        handler.uploaderParams.filters.max_file_size = handler.allowedSizes.max;
      }
    }
    
    handler.loadingItems = true;

    handler.listFilter = {};
    // handler.searchTerms = '';
    handler.pageSize = 10;
    handler.loadedImages = {};


    var FileCollection = handler.FileRepository.getCollection();
    handler.files = new FileCollection();
    handler.uploaderFiles = new FileCollection();

    // Settings
    // ------------------------

    handler.single = handler.attribute.get('field_type') == 'asset';
    handler.multiple = handler.attribute.get('field_type') == 'asset_collection';
    handler.multipleSelection = handler.multiple;
    handler.value = handler.entity.getField(handler.fieldCode);
    if(handler.single) {
      handler.empty = !_.isObject(handler.value);
    } else {
      handler.empty = !handler.value || !handler.value.models.length;
      if(handler.empty) {
        handler.setValue(new FileCollection());
      }
    }

    handler.loadAssets();

    // SELECTION
    // ------------------------
    handler.selectedItems = [];

    handler.clearSelected = function(){
      handler.selectedItems = [];
    };
    
    function addSelected(item) {
      if ( handler.selectedItems.indexOf(item) !== -1 ) {
        return false;
      }
      handler.selectedItems.push(item);
    }
    
    function removeSelected(item) {
      handler.selectedItems.splice(handler.selectedItems.indexOf(item), 1);
    }
    
    handler.selectedItemsCount = function(){
      return handler.selectedItems.length;
    };
    
    handler.hasSelectedItems = function(){
      return handler.selectedItemsCount() > 0;
    }
    
    handler.isSelected = function(item) {
      if(!item) return;

      return _.findWhere(handler.selectedItems, {id: item.id}) !== undefined;
    }
    
    // handler
    handler.itemClicked = function(item) {
      if (handler.multipleSelection) {
        if (handler.isSelected(item)) {
          removeSelected(item);
        } else {
          addSelected(item);
        }
      } else {
        handler.clearSelected();
        addSelected(item);
      }
    }

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
      // this.fetchPage_(1);
    };
    
    // Required.
    DynamicItems.prototype.getItemAtIndex = function(index) {

      var pageNumber = Math.floor(index / (handler.pageSize));
      var page = this.loadedPages[pageNumber];
      console.log('getItemAtIndex', page);
      if (page) {
        console.log('getItemAtIndex page exists', page[index % handler.pageSize])
        return page[index % handler.pageSize];
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
      handler.getFiles(pageNumber).then(function(results){
        // store collection
        handler.filesCollection = results;


        // di.numItems = Math.ceil(results.meta.total / 3);

        di.numItems = results.meta.total;


        // optionaly change collection (filter, sort etc) 
        handler.list = handler.filesCollection.models;
        handler.selectionEmpty = handler.list.length == 0;
        // set listing flags
        di.loadedPages[pageNumber] = [];
        // var itemCounter = 0;
        // var currentArray = [];
        _.each(handler.filesCollection.models, function(item, i, list) {
          // itemCounter++;
          // currentArray.push(item);
          // handler.loadImage(item);
          // if(itemCounter == 3 || i == list.length - 1) {
            
          //   di.loadedPages[pageNumber].push(currentArray);
          //   currentArray = [];
          //   itemCounter = 0;
            
          // }

          handler.loadImage(item);
          di.loadedPages[pageNumber].push(item);
        });

        
        handler.selectionReady = true;
      });
    };

    DynamicItems.prototype.resetItems = function() {
      handler.selectionReady = false;
      this.numItems = 0;
      this.loadedPages = {};
      this.fetchPage_(0);
    };
    
         
    handler.dynamicItems = new DynamicItems();

    /**
     * Parameters:
     *
     * sourceItemScope - the scope of the item being dragged.
     * destScope - the sortable destination scope, the list.
     * destItemScope - the destination item scope, this is an optional Param.(Must check for undefined).
     *
     * Object (event) - structure
     *   source:
     *     index: original index before move.
     *     itemScope: original item scope before move.
     *     sortableScope: original sortable list scope.
     *   dest: index
     *     index: index after move.
     *     sortableScope: destination sortable scope.
     *
     * read more at https://github.com/a5hik/ng-sortable
     */
    handler.dragControlListeners = {
      // override to determine drag is allowed or not. default is true.
      accept: function (sourceItemHandleScope, destSortableScope) {
        // console.log('accept');
        return true;
      },
      dragStart: function (event) {
        // console.log('dragStart', event);
      },
      dragEnd: function (event) {
        // console.log('dragEnd', event);
      },
      itemMoved: function (event) {
        // console.log('itemMoved', event);
        var moveSuccess,
          moveFailure;

        moveSuccess = function () {
          // console.log('moveSuccess');
        };
        moveFailure = function () {
          // console.log('moveFailure');

          // to return an item to it's original position
          // event.dest.sortableScope.removeItem(event.dest.index);
          // event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
        };

      },
      orderChanged: function (event) {
        // console.log('orderChanged', event);
      },
      // optional param
      // containment: '#board',
      // optional param for clone feature.
      // clone: true,
      // optional param allows duplicates to be dropped.
      // allowDuplicates: false
    };

  }

  getFiles(pageNumber) {
    var handler = this;
    var query = _.extend({}, {

      filter: _.extend(handler.listFilter, {
        id: {
          nin: handler.getAssetIds()
        }
      }),
      // offset: pageNumber * handler.pageSize * 3,
      // limit: handler.pageSize * 3,
      offset: pageNumber * handler.pageSize,
      limit: handler.pageSize,
      sort: '-created_at'
    });

    if(handler.allowedTypes && handler.allowedTypes.length) {
      query.filter.mime_type = {
        in: handler.allowedTypes.join(',')
      };
    }

    if(handler.allowedSizes && (handler.allowedSizes.min || handler.allowedSizes.max) ) {
      query.filter.size = {};
      if(handler.allowedSizes.min) {
        query.filter.size.gt = handler.allowedSizes.min;
      }
      if(handler.allowedSizes.max) {
        query.filter.size.lt = handler.allowedSizes.max;
      }
      
    }

    return handler.FileRepository.get(query);
  }

  getAllowedExtensions() {
    var handler = this;

    if(!handler.allowedTypes || !handler.allowedTypes.length) {
      return;
    }

    var extensions = [];
    _.each(handler.assetTypes, function(assetType){
      _.each(assetType.mime_types, function(mimeType){
        _.each(handler.allowedTypes, function(allowedType){
          if(allowedType == mimeType.mime_type) {
            _.each(mimeType.extensions, function(ext){
              extensions.push(ext.replace(/^(\.)/,""))
            });
          }
        });
      });
    });

    return extensions.join(',');
  }

  getAssetIds() {
    var handler = this;


    var ids = [];
    var value = handler.getValue();

    if(!handler.empty) {
      var value = handler.getValue();
      if(handler.single) {
        ids.push(value.id);
      } else {
        _.each(value.models, function(item) {
          ids.push(item.id);
        });
      }
    }

    return ids.join(',');
    
  }

  filterList(filter) {
    var handler = this;
    
    if(!filter && handler.listFilter != {}) {
      handler.listFilter = {};
      handler.dynamicItems.resetItems();
      return;
    }
    var ignoreFilter = false;
    _.each(filter, function(item, key) {
      if(handler.listFilter[key] == item) {
        ignoreFilter = true;
        return;
      }

      if(item == null) {
        delete handler.listFilter[key];
        return;
      }

      handler.listFilter[key] = item;
    });

    if(ignoreFilter) return;

    handler.dynamicItems.resetItems();

  }

  searchList() {
    var handler = this;

    if( handler.searchTerms.length < 1) {
      handler.filterList(null);
      return;
    }
    handler.filterList({s: handler.searchTerms});
  }

  loadAssets() {
    var handler = this;
    var value = handler.entity.getField(handler.fieldCode);
    var filter = {};
    
    var assetsPromise = null;
    if(!handler.empty) {

      if(handler.single) {
        filter.id = value.id;
      } else {
        var ids = [];
        _.each(value.models, function(item){
          ids.push(item.id);
        });
        filter.id = {in: ids.join(',')};
      }

      assetsPromise = handler.FileRepository.get({filter: filter}).then(function(results){
        handler.files = results;
        _.each(handler.files.models, function(image) {
          handler.loadImage(image);
        });
      });
    } else {
      var defered = handler.$q.defer();
      assetsPromise = defered.promise;
      defered.resolve();
    }

    handler.$q.all([assetsPromise]).then(function(){
      handler.loadingItems = false;
    });
  }

  loadImage(model) {
    var handler = this;
    if(model.getType() !== 'image') {
      return;
    }

    handler.loadedImages[model.id] = {
      loaded: false,
      error: false,
      object: null
    };
    handler.loadedImages[model.id].promise = model.load({v: 'admin_image'});

    handler.loadedImages[model.id].promise.then(function(image){
      handler.loadedImages[model.id].loaded = true;
      handler.loadedImages[model.id].object = image;
    }, function(image) {
      handler.loadedImages[model.id].error = true;
      handler.loadedImages[model.id].object = image;
    });
  }

  isLoaded(model) {
    var handler = this;
    if(!model) return;
    if(model.getType() !== 'image') {
      return true;
    }

    if(handler.loadedImages[model.id] && handler.loadedImages[model.id].loaded) {
      return true;
    }

    return false;
  }

  getAsset(model) {
    if(!model) {
      return null;
    }
    var handler = this;
    if(!handler.files){
      return null;
    }

    return handler.files.findWhere({id: model.id});
  }

  getValue() {
    var handler = this;
    return handler.entity.getField(handler.fieldCode);
  }

  setValue(value) {
    var handler = this;
    handler.entity.setField(handler.fieldCode, value);
  }

  getCaption(model) {
    if(!model) {
      return '';
    }
    var handler = this;
    return model.get('caption');
  }

  getFileName(model) {
    if(!model) {
      return '';
    }
    var handler = this;
    return model.get('name');
  }

  getAdminThumb(model) {
    var handler = this;
    if(!model) return;
    return model.getAdminThumbUrl();
  }

  getAdminImage(model) {
    var handler = this;
    if(!model) return;
    return model.getAdminImageUrl();
  }

  getFileType(model) {
    var handler = this;
    if(!model) return;
    return model.getType();
  }

  addAsset() {
    var handler = this;
    handler.dynamicItems.resetItems();
    handler.selectionMode = true;
  }

  cancelSelection() {
    var handler = this;

    handler.selectionMode = false;
  }

  handleSelection() {
    var handler = this;

    if(!handler.selectedItems[0]) {
      handler.selectedItems = [];
      return;
    }
    if(handler.single) {
      var item = handler.selectedItems[0];
      handler.setValue(item);
      handler.files.push(item);
      handler.loadImage(item);
    } else {
      var value = handler.getValue();
      _.each(handler.selectedItems, function(item) {
        value.push(item);
        handler.files.push(item);
        handler.loadImage(item);
      });

      handler.setValue(value);
    }

    handler.selectionMode = false;
    handler.empty = false;
    handler.selectedItems = [];
  }

  editFile(file, event) {
    if(event) {
      event.stopPropagation();
    }
    var handler = this;

    // if(handler.single) {
    //   file = handler.getValue();
    // }
    
    console.log('edit file model', file);

    handler.$mdDialog.show({
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
      console.log('file saved', newFile);
      // handler.filesCollection.add(newDocument);
    });
  }

  removeAsset(model) {
    var handler = this;

    if(handler.single) {
      handler.empty = true;
      handler.setValue(null);
      return;
    }

    var value = handler.getValue();

    value.remove(model);

    if(value.models.length == 0) {
      handler.empty = true;
    }
  }

}

MediaLibraryHandlerController.$inject = [
  'FileRepository',
  'AppSettings',
  '$mdDialog',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];