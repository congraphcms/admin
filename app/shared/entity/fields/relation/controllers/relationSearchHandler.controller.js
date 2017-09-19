
import _ from 'underscore';

export default class RelationSearchHandlerController{

  constructor(
    EntityRepository, 
    AttributeSetsService,
    AttributesService,
    EntityTypesService, 
    EntityTypeCollection,
    EntityModel,
    ChooseSetService,
    ChooseEntityTypeService,
    EntityQuickForm,
    AppSettings, 
    $scope, 
    $rootScope, 
    $state, 
    $stateParams, 
    $q, 
    $timeout
  ) {

    /* jshint validthis: true */
    let handler = this;

    handler.$scope = $scope;
    handler.$rootScope = $rootScope;
    handler.$state = $state;
    handler.$stateParams = $stateParams;
    handler.$q = $q;
    handler.$timeout = $timeout;

    handler.EntityRepository = EntityRepository;
    handler.AttributesService = AttributesService;
    handler.AttributeSetsService = AttributeSetsService;
    handler.EntityTypesService = EntityTypesService;
    handler.EntityTypeCollection = EntityTypeCollection;
    handler.EntityModel = EntityModel;
    handler.ChooseSetService = ChooseSetService;
    handler.ChooseEntityTypeService = ChooseEntityTypeService;
    handler.EntityQuickForm = EntityQuickForm;
    handler.AppSettings = AppSettings;

    // handler.attribute = handler.$scope.attribute;
    // handler.entity = handler.$scope.entity;

    handler.init();
  }

  init() {
    let handler = this;
    
    handler.fieldCode = handler.attribute.get('code');
    handler.fieldName = handler.attribute.get('admin_label');
    handler.required = handler.attribute.get('required');
    handler.unique = handler.attribute.get('unique');
    handler.attributeData = handler.attribute.get('data');
    handler.allowedTypes = handler.attributeData.allowed_types;
    handler.loadingItems = true;

    handler.listFilter = {};
    handler.searchTerms = '';
    handler.pageSize = 30;

    let EntityCollection = handler.EntityRepository.getCollection();
    handler.relations = new EntityCollection();

    // Settings
    // ------------------------

    handler.single = handler.attribute.get('field_type') == 'relation';
    handler.multiple = handler.attribute.get('field_type') == 'relation_collection';
    handler.multipleSelection = handler.multiple;
    handler.value = handler.entity.getField(handler.fieldCode);
    if(handler.single) {
      handler.empty = !_.isObject(handler.value);
    } else {
      handler.empty = !handler.value || !handler.value.models || !handler.value.models.length;
      if(handler.empty) {
        handler.setValue(new EntityCollection());
      }
    }

    handler.loadRelations();

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
      return handler.selectedItems.indexOf(item) !== -1;
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
    let DynamicItems = function() {
      /**
       * @type {!Object<?Array>} Data pages, keyed by page number (0-index).
       */
      this.loadedPages = {};
      /** @type {number} Total number of items. */
      this.numItems = 0;
      /** @const {number} Number of items to fetch per request. */
      this.fetchPage_(1);
    };
    
    // Required.
    DynamicItems.prototype.getItemAtIndex = function(index) {
      let pageNumber = Math.floor(index / handler.pageSize);
      let page = this.loadedPages[pageNumber];
      if (page) {
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
      let di = this;
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;
      // For demo purposes, we simulate loading more items with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      handler.getEntities(pageNumber).then(function(results){
        // store collection
        handler.entitiesCollection = results;
        di.numItems = results.meta.total;
        // optionaly change collection (filter, sort etc) 
        handler.list = handler.entitiesCollection.models;
        // set listing flags
        handler.selectionReady = true;

        di.loadedPages[pageNumber] = [];
        _.each(handler.entitiesCollection.models, function(item) {
          di.loadedPages[pageNumber].push(item);
        });
      });
    };

    DynamicItems.prototype.resetItems = function() {
      handler.selectionReady = false;
      this.numItems = 0;
      this.loadedPages = {};
      this.fetchPage_(1);
    };
    
         
    handler.dynamicItems = new DynamicItems();

  }

  getEntities(pageNumber) {
    let handler = this;

    let query = _.extend({}, {

      filter: _.extend(handler.listFilter, {
        id: {
          nin: handler.getRelationIds()
        }
      }),
      offset: pageNumber * handler.pageSize,
      limit: handler.pageSize
    });

    if(handler.allowedTypes && handler.allowedTypes.length) {
      query.filter.entity_type_id = {
        in: handler.allowedTypes.join(',')
      };
    }

    return handler.EntityRepository.get(query);
  }

  getRelationIds() {
    let handler = this;


    let ids = [];
    let value = handler.getValue();

    if(!handler.empty) {
      let value = handler.getValue();
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
    let handler = this;
    
    if(!filter && handler.listFilter != {}) {
      handler.listFilter = {};
      handler.dynamicItems.resetItems();
      return;
    }
    let ignoreFilter = false;
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
    let handler = this;

    if( handler.searchTerms.length < 1) {
      handler.filterList(null);
      return;
    }
    handler.filterList({s: handler.searchTerms});
  }

  loadRelations() {

    let handler = this;
    let value = handler.entity.getField(handler.fieldCode);
    let filter = {};
    
    let relationsPromise = null;
    if(!handler.empty) {

      if(handler.single) {
        filter.id = value.id;
      } else {
        let ids = [];
        _.each(value.models, function(item){
          ids.push(item.id);
        });
        filter.id = {in: ids.join(',')};
      }

      relationsPromise = handler.EntityRepository.get({filter: filter, include:'attribute_set'}).then(function(results){
        handler.relations = results;
      });
    } else {
      let defered = handler.$q.defer();
      relationsPromise = defered.promise;
      defered.resolve();
    }
    

    let contentModelPromise = handler.EntityTypesService.getAll().then(function(results){
      handler.contentModels = results;
    });

    handler.$q.all([relationsPromise, contentModelPromise]).then(function(){

      handler.loadingItems = false;
    });
  }

  getRelation(model) {
    let handler = this;
    if(!handler.relations){
      return null;
    }

    return handler.relations.findWhere({id: model.id});
  }

  getValue() {
    let handler = this;
    return handler.entity.getField(handler.fieldCode);
  }

  setValue(value) {
    let handler = this;
    handler.entity.setField(handler.fieldCode, value);
  }

  getTitle(model) {
    if(!model) {
      return '';
    }
    let handler = this;
    let relationLocale = handler.getRelationLocale(model);

    return model.getTitle(relationLocale);
  }

  getType(model) {
    if(!model) {
      return '';
    }
    let handler = this;
    // let relationLocale = handler.getRelationLocale(model);

    return model.get('entity_type');
  }

  getStatus(model) {
    if(!model) {
      return '';
    }
    let handler = this;
    let contentModel = handler.contentModels.findWhere({id: model.get('entity_type_id')});
    let workflow = contentModel.attributes.workflow;
    let status = model.get('status');
    if(_.isObject(status)) {
      let relationLocale = handler.getRelationLocale(model);
      status = status[relationLocale]
    }
    let relationLocale = handler.getRelationLocale(model);
    
    let workflowPoint = workflow.attributes.points.findWhere({status: status});

    return workflowPoint.get('name');
  }

  getRelationLocale(model) {
    let handler = this;
    let status = model.get('status');
    let localeCode = (handler.locale)?handler.locale.get('code'):0;
    let defaultLocale = handler.locales.findWhere({id: parseInt(handler.AppSettings.APP.DEFAULT_LOCALE)});
    let relationLocale = null;
    let relationDefaultLocale = null;
    let relationFallbackLocale = null;
    _.each(status, function(value, key) {

      if(key == localeCode) {
        relationLocale = localeCode;
      }
      if(key == defaultLocale.get('code')) {
        relationDefaultLocale = key;
      }
      relationFallbackLocale = key;
    });

    if(relationLocale) {
      return relationLocale;
    }

    if(relationDefaultLocale) {
      return relationDefaultLocale;
    }

    return relationFallbackLocale;
  }

  editEntity(entity) {
    let handler = this;

    handler.getEntityForEdit(entity).then(function(model){
      handler.getAttributesForNewEntity().then(function(attributes){
        console.log('got attributes');
        handler.getEntityTypeForEntity(entity).then(function(contentModel){
          console.log('got contentModel');
          handler.getAttributeSetForEntity(entity).then(function(attributeSet){
            console.log('got attributeSet');
            model.setEntityType(contentModel);
            model.setAttributeSet(attributeSet);
            
            let formSettings = {
              model: model,
              attributes: attributes,
              attributeSet: attributeSet,
              contentModel: contentModel,
              locales: handler.locales,
              locale: handler.locale,
              scope: handler.$scope.$new()
            };

            console.log('open entity quick form');
            
            handler.EntityQuickForm.open(formSettings).then(
              function(payload){
                console.log('qf saved', payload);
                // handler.selectedItems = [payload];
                // handler.handleSelection();
              }, 
              function(msg){
                console.log('qf canceled', msg);
              }
            );
          }, function(errors) {
            console.log('can\' find attribute set', errors);
          });
        }, function(errors) {
          console.log('can\' find entity type', errors);
        });
      }, function(errors) {
        console.log('can\' find attributes', errors);
      });
    }, function(errors) {
        console.log('can\' find entity', errors);
      });
      
  }

  createNew() {
    let handler = this;
    // get content model
    handler.getAttributesForNewEntity().then(function(attributes){
      handler.getEntityTypeForNewEntity().then(function(contentModel){

        handler.getAttributeSetForNewEntity(contentModel).then(function(attributeSet){

          let model = new handler.EntityModel();
          
          model.setEntityType(contentModel);
          model.setAttributeSet(attributeSet);
          
          let defaultPoint = contentModel.get('default_point');
          let status = defaultPoint.get('status');
          
          model.set('status', status);
          if(handler.locale) {
            console.log('handler locale', handler.locale);
            model.set('locale', handler.locale.get('code'));
          }
          
          let formSettings = {
            model: model,
            attributes: attributes,
            attributeSet: attributeSet,
            contentModel: contentModel,
            locales: handler.locales,
            locale: handler.locale,
            scope: handler.$scope.$new()
          };
          
          handler.EntityQuickForm.open(formSettings).then(
            function(payload){
              console.log('qf saved', payload);
              handler.selectedItems = [payload];
              handler.handleSelection();
            }, 
            function(msg){
              console.log('qf canceled', msg);
            }
          );
        });
      });
    });
  }

  getEntityForEdit(entity) {
    let handler = this;
    return handler.EntityRepository.get(entity.get('id'), {locale: handler.locale.get('code')});
  }

  getEntityTypeForEntity(entity) {
    let handler = this;
    let entityTypeId = entity.get('entity_type_id');

    let contentModel = false;
    let cmPromise = false;
    let defered = handler.$q.defer();

    cmPromise = handler.EntityTypesService.getById(entityTypeId).then(function(type) {
      contentModel = type;
      defered.resolve(contentModel);
      // return contentModel
    }, function(errors){
      defered.reject(errors);
    });

    return defered.promise;
  }

  getEntityTypeForNewEntity(){
    let handler = this;
    // get content model
    let entityTypeId = (handler.allowedTypes.length === 1)?handler.allowedTypes[0]: false;
    let contentModel = false;
    let contentModels = false;
    let cmPromise = false;
    let defered = handler.$q.defer();

    if(!entityTypeId) {
      cmPromise = handler.EntityTypesService.getAll().then(function(types){
        if(handler.allowedTypes.length > 0) {
          contentModels = [];
          _.each(handler.allowedTypes, function(typeID){
            let model = types.findWhere({id: typeID});
            if(model) {
              contentModels.push(model);
            }
          });
        }else {
          contentModels = types;
        }
        
        contentModels = new handler.EntityTypeCollection(contentModels);
        // modal for choosing entity type
        handler.ChooseEntityTypeService.choose(contentModels)
          .then(
            function(type){
              contentModel = type;
              defered.resolve(contentModel);
            }, function(){
              defered.reject();
              return;
            }
          );
      }, function(errors){
        defered.reject(errors);
      });
    }else{
      cmPromise = handler.EntityTypesService.getById(entityTypeId).then(function(type) {
        contentModel = type;
        defered.resolve(contentModel);
        // return contentModel
      }, function(errors){
        defered.reject(errors);
      });
    }

    return defered.promise;
  }

  getAttributeSetForNewEntity(contentModel) {
    // get attribute sets
    let handler = this;
    let defered = handler.$q.defer();
    
    let asPromise = handler.AttributeSetsService.getByType(contentModel.get('id'));
    

    asPromise.then(function(attributeSets){
      // open modal for attribute set choice
      handler.ChooseSetService.choose(attributeSets, contentModel)
        .then(
          function(set){
            let attributeSet = set;
            defered.resolve(attributeSet);
            return set;
          }, function(){
            defered.reject();
            return;
          }
        );
    }, function(){
      defered.reject();
      return;
    });

    return defered.promise;
  }

  getAttributeSetForEntity(entity) {
    let handler = this;
    let attributeSetId = entity.get('attribute_set_id');

    let attributeSet = false;
    let asPromise = false;
    let defered = handler.$q.defer();

    asPromise = handler.AttributeSetsService.getById(attributeSetId).then(function(set) {
      attributeSet = set;
      defered.resolve(attributeSet);
      return attributeSet
    }, function(errors){
      defered.reject(errors);
    });

    return defered.promise;
  }

  getAttributesForNewEntity(){
    // get attribute sets
    let handler = this;
    let defered = handler.$q.defer();
    
    let aPromise = handler.AttributesService.getAll();
    

    aPromise.then(function(attributes){
        defered.resolve(attributes);
        return attributes;
      }, function(){
        defered.reject();
        return;
      });

    return defered.promise;
  }

  addRelation() {
    let handler = this;
    handler.dynamicItems.resetItems();
    handler.selectionMode = true;
  }

  cancelSelection() {
    let handler = this;

    handler.selectionMode = false;
  }

  handleSelection() {
    let handler = this;

    if(!handler.selectedItems[0]) {
      handler.selectedItems = [];
      return;
    }
    if(handler.single) {
      handler.setValue(handler.selectedItems[0]);
      handler.relations.add([handler.selectedItems[0]]);
    } else {
      let value = handler.getValue();
      _.each(handler.selectedItems, function(item) {
        value.push(item);
        handler.relations.push(item);
      });

      // handler.setValue(value);
    }
    
    handler.selectionMode = false;
    handler.empty = false;
    handler.selectedItems = [];
  }

  removeRelation(model) {
    let handler = this;

    if(handler.single) {
      handler.empty = true;
      handler.setValue(null);
      return;
    }

    let value = handler.getValue();

    value.remove(model);

    if(value.models.length == 0) {
      handler.empty = true;
    }
  }
}

RelationSearchHandlerController.$inject = [
  'EntityRepository',
  'AttributeSetsService',
  'AttributesService',
  'EntityTypesService',
  'EntityTypeCollection',
  'EntityModel',
  'ChooseSetService',
  'ChooseEntityTypeService',
  'EntityQuickForm',
  'AppSettings',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q', 
  '$timeout',
];