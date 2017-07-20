
import _ from 'underscore';
import plupload from 'plupload';

export default class PluploadController{
  constructor(cbOAuth, AppSettings, $scope, $timeout, $rootScope, $state, $element, $attrs, $document) {

    /* jshint validthis: true */
    var pl = this;

    pl.$scope = $scope;
    pl.$rootScope = $rootScope;
    pl.$timeout = $timeout;
    pl.$element = $element;
    pl.$attrs = $attrs;
    pl.$document = $document;
    pl.cbOAuth = cbOAuth;
    pl.AppSettings = AppSettings;

    pl.init();
  }

  init() {
    var pl = this;

    if(!pl.$attrs.id){
      var randomValue = pl.randomString(5);
      pl.$attrs.$set('id',randomValue);
    }

    /**
     * @TO_DO :
     * 1. change default url, so that it does not depend on the global CB (CookBook) object
     */
    pl.defaultParams = {
      runtimes: 'html5',
      browse_button: pl.$attrs.id,
      multi_selection: true,
      multipart: true,
      multiple_queues: true,
      max_file_count: 0,
      //container : 'abc',
      max_file_size : '8mb',
      url : pl.AppSettings.APP.CG_URL + 'api/files',
      headers: {
        'Authorization': pl.cbOAuth.getAuthorizationHeader()
      }
      // filters : [{title: "Image files", extensions: "jpg,jpeg,gif,png,tiff"}]
    };
    if(!pl.params){
      pl.params = {};
    }

    var params = {};
    angular.extend(params, pl.defaultParams, pl.params);

    if(pl.multiParams){
      params.multipart_params = pl.multiParams;
    }


    pl.uploader = new plupload.Uploader(params);

    if(pl.multiParams){
      params.multipart_params.uploader_id = pl.uploader.id;
    }

    pl.uploader.bind('Init', function(up, params) {

    });

    pl.uploader.init();
    pl.uploader.settings.multipart_params = params.multipart_params;

    if(pl.uploaderId){
      pl.uploader.id = pl.uploaderId;
    }else{
      pl.uploaderId = pl.uploader.id;
    }

    pl.uploader.settings.file_data_name = 'file';

    pl.uploader.bind('Error', function(up, err) {
      pl.$scope.$emit('PLUPLOAD.error', {uploader: up, error: err, meta:pl.meta});
          up.refresh(); // Reposition Flash/Silverlight
    });

    pl.uploader.bind('FilesAdded',function(up,files){

      if( !_.isArray(pl.filesModel) ){
        pl.filesModel = [];
      }

      var maxCountError = false;
      var addedFiles = [];

      files.reverse();

      angular.forEach(files, function(file){

        var i = pl.uploader.files.length;

        if(pl.uploader.settings.max_file_count && i > pl.uploader.settings.max_file_count){
          pl.uploader.removeFile(file);
          i = pl.uploader.files.length;
        }else{
          pl.filesModel.push(file);
          addedFiles.push(file);
        }
      });

      if(addedFiles.length > 0){
        addedFiles.reverse();
        if(pl.$attrs.autoUpload || pl.$attrs.autoUpload=="true"){
          pl.uploader.start();
        }

        pl.$scope.$emit('PLUPLOAD.files.added', {uploader: up, files: addedFiles, meta:pl.meta});
      }


    });

    pl.uploader.bind('UploadFile', function(up, file){
      pl.$scope.$emit('PLUPLOAD.files.upload', {uploader: up, file: file, meta:pl.meta});
    });

    pl.uploader.bind('FileUploaded', function(up, file, res) {

      res = angular.fromJson(res.response);

      angular.forEach(pl.filesModel, function(file,key){
        pl.allUploaded = false;
        if(file.percent==100){
          pl.allUploaded = true;
        }
      });

      pl.$scope.$emit('PLUPLOAD.files.uploaded', {uploader: up, file: file, result: res, meta:pl.meta});


      if(pl.allUploaded) {
        pl.$scope.$emit('PLUPLOAD.files.uploaded.all', {uploader: up, file: file, result: res, meta:pl.meta});
      }
    });

    pl.uploader.bind('UploadProgress',function(up,file){

      var sum = 0;
      angular.forEach(pl.filesModel, function(file, key){
        sum += file.percent;
      });

      sum = Math.round(sum / pl.filesModel.length);

      pl.$scope.$emit('PLUPLOAD.files.progress', {uploader: up, file: file, progress: file.percent, summary: sum, meta:pl.meta});

    });

    pl.instance = pl.uploader;
  }

  randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
      var randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
  }
}

PluploadController.$inject = [
  'cbOAuth',
  'AppSettings',
  '$scope',
  '$timeout',
  '$rootScope',
  '$state',
  '$element',
  '$attrs',
  '$document'
];
