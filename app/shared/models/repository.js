
import * as CB from './cb.js';
import _ from 'underscore';

export default RepositoryFactory;

function RepositoryFactory(AppSettings, $http, $q, Client){

  class Repository{

    constructor(endpoint){

      // properties
      this.client = null;
      this.Model = CB.Model;
      this.Collection = CB.Collection;
      this.endpoint = endpoint;

      this.createClient(endpoint);
    }

    createClient(endpoint){
      endpoint || (endpoint = '');
      this.client = new Client(AppSettings.APP.CG_URL+'congraph/api/v1', endpoint);
    }


    setModel(Model){
      this.Model = Model;
    }

    getModel(){
      return this.Model;
    }

    setCollection(Collection){
      this.Collection = Collection;
    }

    getCollection(){
      return this.Collection;
    }

    get(id, params){
      var self = this;
      if(_.isObject(id)){
        params = id;
      }
      params || (params = {});

      if(params instanceof this.Model){
        params = {};
      }else{
        delete params.id;
      }


      var defered = $q.defer();

      if(_.isString(id) || _.isNumber(id)){
        this.client.fetch(id, params)
          .then(function(data){
            var response = data.data;
            var result = new self.Model(response.data);
            defered.resolve(result);
            return result;
          })
          .catch(function(data){
            defered.reject(data.data);
            return data.data;
          });

        return defered.promise;
      }
      
      this.client.get(params)
        .then(function(data){
          var response = data.data;
          var result = new self.Collection(response.data);
          result.meta = response.meta;
          result.links = response.links;
          defered.resolve(result);
          return result;
        })
        .catch(function(data){
          defered.reject(data.data);
          return data.data;
        });

      return defered.promise;
    }

    save(model){
      if(! _.isObject(model) || ! (model instanceof this.Model)){
        throw new Error('You can only save Models of this repository.');
      }

      var self = this;
      var data = model.getData();
      var defered = $q.defer();

      if(model.isNew()){
        this.client.create(data)
          .then(function(data){
            var response = data.data;
            var result = new self.Model(response.data);
            defered.resolve(result);
            return result;
          })
          .catch(function(data){
            defered.reject(data.data);
            return data.data;
          });

        return defered.promise;
      }

      this.client.update(model.id, data)
        .then(function(data){
          var response = data.data;
          var result = new self.Model(response.data);
          defered.resolve(result);
          return result;
        })
        .catch(function(data){
          defered.reject(data.data);
          return data.data;
        });
      return defered.promise;
    }

    delete(model){
      if(! (model instanceof this.Model)){
        throw new Error('You can only delete Models of this repository.');
      }
      if(model.isNew()){
        throw new Error('You can\'t delete new model.');
      }
      var self = this;
      var defered = $q.defer();

      this.client.delete(model.id)
        .then(function(data){
          var response = data.data;
          defered.resolve(null);
          return response;
        })
        .catch(function(data){
          defered.reject(data.data);
          return data.data;
        });
      return defered.promise;
    }

    newModel(attributes, options){
      return new this.Model(attributes, options);
    }

    newCollection(models, options){
      return new this.Collection(models, options);
    }

  };

  Repository.extend = CB.Model.extend;

  return Repository;
}

RepositoryFactory.$inject = [
  "AppSettings",
  "$http",
  "$q",
  "Client"
];
