
import _ from 'underscore';
import Qs from 'qs';

export default ClientFactory;

function ClientFactory($http, $q){
    
  class Client{
    constructor(domain, url){

      // properties
      this.acceptHeader = 'application/json';
      this.domain = '';
      this.url = '';

      // init
      domain || (domain = '');
      url || (url = '');
      this.setDomain(domain);
      this.setUrl(url);
    }    

    cleanUrl(url){
      var newUrl = '';
      do {
        newUrl = url;
        url = url.replace(/([^:]\/|^\/)\/+/g, '$1');
      } while (newUrl != url);

      return url;
    }
    
    setDomain(domain){
      this.domain = this.cleanUrl(domain);
    }
    
    setUrl(url){
      this.url = this.cleanUrl(url);
    }

    fetch(id, params, endpoint){
      if(_.isNull(id)) throw new Error("You need to specify ID for object fetch.");
      params || (params = {});
      endpoint || (endpoint = this.url);
      var url = this.cleanUrl(this.domain + '/' + endpoint + '/' + id);

      if (!_.isEmpty(params)) {
        url += '?' + Qs.stringify(params);
      }

      var config = {
        'responseType': 'json',
        'headers': {
          'Accept': this.acceptHeader
        },
      };

      return $http.get(url, config);
    }

    get(params, endpoint){
      params || (params = {});
      endpoint || (endpoint = this.url);
      var url = this.cleanUrl(this.domain + '/' + endpoint);
       
      if (!_.isEmpty(params)) {
        url += '?' + Qs.stringify(params);
      }

      var config = {
        //'params': params,
        'responseType': 'json',
        'headers': {
          'Accept': this.acceptHeader
        },
      };

      return $http.get(url, config);
    }

    create(data, endpoint){
      if (_.isNull(data)) throw new Error("You need to specify Data to post.");
      endpoint || (endpoint = this.url);
      var url = this.cleanUrl(this.domain + '/' + endpoint);
      var config = {
        'data': data,
        'responseType': 'json',
        'headers': {
          'Accept': this.acceptHeader
        },
      };

      return $http.post(url, config);
    }

    update(id, data, endpoint){
      if (_.isNull(id)) throw new Error("You need to specify ID for object update.");
      if (_.isNull(data)) throw new Error("You need to specify Data to post.");
      endpoint || (endpoint = this.url);
      var url = this.cleanUrl(this.domain + '/' + endpoint + '/' + id);
      var config = {
        'data': data,
        'responseType': 'json',
        'headers': {
          'Accept': this.acceptHeader
        },
      };

      return $http.put(url, config);
    }

    delete(id, endpoint){
      if(_.isNull(id)) throw new Error("You need to specify ID for object delete.");
      endpoint || (endpoint = this.url);
      var url = this.cleanUrl(this.domain + '/' + endpoint + '/' + id);
      var config = {
        'responseType': 'json',
        'headers': {
          'Accept': this.acceptHeader
        },
      };

      return $http.delete(url, config);
    }

  }

  return Client;
}

ClientFactory.$inject = ["$http", "$q"];