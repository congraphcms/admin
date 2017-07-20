
import _ from 'underscore';

export default class MediaUploaderController{
  constructor(FileRepository, $scope, $rootScope, $timeout, $state, $element, $attrs, $document) {

    /* jshint validthis: true */
    var mu = this;

    mu.$scope = $scope;
    mu.$rootScope = $rootScope;
    mu.$timeout = $timeout;
    mu.$element = $element;
    mu.$attrs = $attrs;
    mu.$document = $document;

    mu.FileRepository = FileRepository;

    mu.init();
  }

  init() {
    var mu = this;

    mu.loadedImages = {};
    mu.uploads = [];
    var FileCollection = mu.FileRepository.getCollection();
    if( !(mu.files instanceof FileCollection) ) {
      mu.files = new FileCollection();
    }

    mu.$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
      mu.stop();
    });

    // handle PLUPLOAD files added
    mu.$scope.$on('PLUPLOAD.files.added', function(e, data){
      // check if event is triggered by uploader of this directive
      if(data.uploader.id != mu.instance.id){
        return;
      }
      // create item for each file that is added and push it to files list
      _.each(data.files, function(file){
        var item = {
          status: 'added',
          pluploadId: file.id,
          pluploadFile: file,
          item: null,
          loaded: false,
          object: null,
          progress: 0,
          model: null,
          id: null,
          message: ''
        };
        mu.uploads.push(item);
      });
    });

    // handle PLUPLOAD files upload start
    mu.$scope.$on('PLUPLOAD.files.upload', function(e, data){
      // check if event is triggered by uploader of this directive
      if(data.uploader.id != mu.instance.id){
        return;
      }
      // update status for item when upload starts
      mu.$timeout(function(){
        var item = _.findWhere(mu.uploads, {pluploadId: data.file.id});
        item.status = 'uploading';
      }, 0);
    });

    // handle PLUPLOAD files progress
    mu.$scope.$on('PLUPLOAD.files.progress', function(e, data){
      // check if event is triggered by uploader of this directive
      if(data.uploader.id != mu.instance.id){
        return;
      }

      mu.$timeout(function(){
        // update progress of a file
        var item = _.findWhere(mu.uploads, {pluploadId: data.file.id});
        if(!item) {
          return;
        }
        item.progress = data.progress;
      }, 0);
    });

    // handle PLUPLOAD files uploaded
    mu.$scope.$on('PLUPLOAD.files.uploaded', function(e, data){
      // check if event is triggered by uploader of this directive
      if(data.uploader.id != mu.instance.id){
        return;
      }
      var FileModel = mu.FileRepository.getModel();
      // load image model in corresponding item
      mu.$timeout(function(){
        var item = _.findWhere(mu.uploads, {pluploadId: data.file.id});
        if(!item) {
          return;
        }
        item.model = new FileModel(data.result.data);
        item.id = item.model.id;
        item.status = 'uploaded';
        mu.files.push(item.model);
        mu.loadImage(item.model);
        // item.url = CB.site_url + '/uploads/' + data.result.result.file.url;
      }, 0);
    });

    

    // handle PLUPLOAD error
    mu.$scope.$on('PLUPLOAD.error', function(e, data){
      // check if event is triggered by uploader of this directive
      if(data.uploader.id != mu.instance.id){
        return;
      }

      // update status for item when upload starts
      mu.$timeout(function(){
        var item = _.findWhere(mu.uploads, {pluploadId: data.error.file.id});
        if(!item) {
          return;
        }
        item.error = true;
        item.message = data.error.message;
        item.status = 'error';
      }, 0);
    });

    // SELECTION
    // ------------------------

    mu.clearSelected = function(){
      mu.selection = [];
    };
    
    function addSelected(item) {
      if ( mu.selection.indexOf(item) !== -1 ) {
        return false;
      }
      mu.selection.push(item);
    }
    
    function removeSelected(item) {
      mu.selection.splice(mu.selection.indexOf(item), 1);
    }
    
    mu.selectedItemsCount = function(){
      return mu.selection.length;
    };
    
    mu.hasSelectedItems = function(){
      return mu.selectedItemsCount() > 0;
    }
    
    mu.isSelected = function(item) {
      if(!item) return;

      return _.findWhere(mu.selection, {id: item.id}) !== undefined;
    }
    
    mu.itemClicked = function(item) {
      if(! item || item.status != 'uploaded' || !item.model) {
        return;
      }

      if (mu.multipleSelection) {
        if (mu.isSelected(item.model)) {
          removeSelected(item.model);
        } else {
          addSelected(item.model);
        }
      } else {
        mu.clearSelected();
        addSelected(item.model);
      }
    }


  }

  loadImage(model) {
    var mu = this;
    if(model.getType() !== 'image') {
      return;
    }
    var upload = _.findWhere(mu.uploads, {id: model.id});

    upload.imagePromise = model.load();

    upload.imagePromise.then(function(image){
      upload.loaded = true;
      upload.object = image;
    }, function(image) {
      upload.error = true;
      upload.object = image;
    });
  }

  isLoaded(model) {
    var mu = this;
    if(!model) return;
    if(model.getType() !== 'image') {
      return true;
    }

    if(_.findWhere(mu.uploads, {id: model.id})) {
      return true;
    }

    return false;
  }

  getCaption(model) {
    if(!model) {
      return '';
    }
    var mu = this;
    return model.get('caption');
  }

  getFileName(model) {
    if(!model) {
      return '';
    }
    var mu = this;
    return model.get('name');
  }

  getAdminThumb(model) {
    var mu = this;
    if(!model) return;
    return model.getAdminThumbUrl();
  }

  getFileType(model) {
    var mu = this;
    if(!model) return;
    return model.getType();
  }

  // cancel dialog function
  stop(){
    var mu = this;
    mu.instance.stop();
  };

  hasFiles(){
    var mu = this;
    return mu.uploads && mu.uploads.length;
  };

  removeItem(item){
    var mu = this;
    var statusBefore = item.pluploadFile.status;
    mu.instance.removeFile(item.pluploadFile);

    var index = _.indexOf(mu.uploads, item);
    if(index > -1){
      mu.uploads.splice(index, 1);
    }
    if(mu.instance.state == plupload.STARTED && statusBefore == plupload.UPLOADING){
      mu.instance.stop();
      mu.instance.start();
    }
  }
}
MediaUploaderController.$inject = [
  'FileRepository', 
  '$scope', 
  '$rootScope',
  '$timeout', 
  '$state',
  '$element', 
  '$attrs',
  '$document'
];