
import * as CB from './../cb.js';
import _ from 'underscore';
import Qs from 'qs';

export default FileModelFactory;

function FileModelFactory(AppSettings, cbOAuth, $q){

  var FileModel = CB.Model.extend({
    defaults: {
      type: 'file',
      url: null,
      name: '',
      extension: null,
      mime_type: null,
      size: 0,
      caption: '',
      description: ''
    },

    cleanUrl: function(url){
      var newUrl = '';
      do {
        newUrl = url;
        url = url.replace(/([^:]\/|^\/)\/+/g, '$1');
      } while (newUrl != url);

      return url;
    },

    load: function(params) {
      var url = this.getUrl(params);

      var image = new Image();
      image.onload = function(){
        defered.resolve(this);
      };
      image.onerror = function(){
        defered.reject(this);
      };

      image.src = url;

      var defered = $q.defer();

      return defered.promise;
    },

    getUrl: function(params) {
      params || (params = {});
      params.access_token = cbOAuth.getAccessToken();
      var endpoint = AppSettings.APP.CG_URL + 'api';
      var url = this.cleanUrl(endpoint + '/' + this.get('url'));

      if (!_.isEmpty(params)) {
        url += '?' + Qs.stringify(params);
      }

      return url;
    },

    getAdminThumbUrl: function() {
      return this.getUrl({v: 'admin_thumb'});
    },

    getAdminImageUrl: function() {
      return this.getUrl({v: 'admin_image'});
    },

    getType: function() {
      var mime = this.get('mime_type');
      if(!mime) {
        return null;
      }

      var mimeParts = mime.split('/');

      return mimeParts[0];
    },

    isImage: function() {
      return this.getType() == 'image';
    },

    isVideo: function() {
      return this.getType() == 'video';
    },

    isAudio: function() {
      return this.getType() == 'audio';
    },

    isDocument: function() {
      return !this.isImage() && !this.isVideo() && !this.isAudio();
    },

  });

  CB.models.file = FileModel;
  
  return FileModel;
}

FileModelFactory.$inject = ['AppSettings', 'cbOAuth', '$q'];