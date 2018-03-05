
import _ from 'underscore';

export default class RelationSearchHandlerController {

  constructor(
    EntityRepository,
    AttributeSetsService,
    EntityTypesService,
    EntityModel,
    ChooseSetService,
    EntityQuickForm,
    AppSettings,
    fieldTypes,
    debounce,
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $q,
    $timeout
  ) {

    /* jshint validthis: true */
    var handler = this;

    handler.$scope = $scope;
    handler.$rootScope = $rootScope;
    handler.$state = $state;
    handler.$stateParams = $stateParams;
    handler.$q = $q;
    handler.$timeout = $timeout;

    handler.EntityRepository = EntityRepository;
    handler.AttributeSetsService = AttributeSetsService;
    handler.EntityTypesService = EntityTypesService;
    handler.EntityModel = EntityModel;
    handler.ChooseSetService = ChooseSetService;
    handler.EntityQuickForm = EntityQuickForm;
    handler.AppSettings = AppSettings;
    handler.fieldTypes = fieldTypes;

    handler.debounce = debounce;

    handler.debounceSearch = handler.debounce(700, function () {
      if (handler.searchTerms.length < 1) {
        handler.filterList(null);
        return;
      }
      handler.filterList({ s: handler.searchTerms });
    });

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
    handler.allowedTypes = handler.attributeData.allowed_types;
    handler.loadingItems = true;

    handler.listFilter = {};
    handler.searchTerms = '';
    handler.pageSize = 30;

    var EntityCollection = handler.EntityRepository.getCollection();
    handler.relations = new EntityCollection();

    // Settings
    // ------------------------

    handler.single = !handler.fieldTypes[handler.attribute.get('field_type')].has_multiple_values;
    handler.multiple = !handler.single;
    handler.multipleSelection = handler.multiple;
    handler.value = handler.entity.getField(handler.fieldCode);
    if (handler.single) {
      handler.empty = !_.isObject(handler.value);
    } else {
      handler.empty = !handler.value || !handler.value.models || !handler.value.models.length;
      if (handler.empty) {
        handler.setValue(new EntityCollection());
      }
    }

    handler.loadRelations();

    // SELECTION
    // ------------------------
    handler.selectedItems = [];

    handler.clearSelected = function () {
      handler.selectedItems = [];
    };

    function addSelected(item) {
      if (handler.selectedItems.indexOf(item) !== -1) {
        return false;
      }
      handler.selectedItems.push(item);
    }

    function removeSelected(item) {
      handler.selectedItems.splice(handler.selectedItems.indexOf(item), 1);
    }

    handler.selectedItemsCount = function () {
      return handler.selectedItems.length;
    };

    handler.hasSelectedItems = function () {
      return handler.selectedItemsCount() > 0;
    }

    handler.isSelected = function (item) {
      return handler.selectedItems.indexOf(item) !== -1;
    }

    // handler
    handler.itemClicked = function (item) {
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
    var DynamicItems = function () {
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
    DynamicItems.prototype.getItemAtIndex = function (index) {
      var pageNumber = Math.floor(index / handler.pageSize);
      var page = this.loadedPages[pageNumber];
      if (page) {
        return page[index % handler.pageSize];
      } else if (page !== null) {
        this.fetchPage_(pageNumber);
      }
    };

    // Required.
    DynamicItems.prototype.getLength = function () {
      return this.numItems;
    };

    DynamicItems.prototype.fetchPage_ = function (pageNumber) {
      var di = this;
      // Set the page to null so we know it is already being fetched.
      this.loadedPages[pageNumber] = null;
      // For demo purposes, we simulate loading more items with a timed
      // promise. In real code, this function would likely contain an
      // $http request.
      handler.getEntities(pageNumber).then(function (results) {
        // store collection
        handler.entitiesCollection = results;
        di.numItems = results.meta.total;
        // optionaly change collection (filter, sort etc) 
        handler.list = handler.entitiesCollection.models;
        // set listing flags
        handler.selectionReady = true;

        di.loadedPages[pageNumber] = [];
        _.each(handler.entitiesCollection.models, function (item) {
          di.loadedPages[pageNumber].push(item);
        });
      });
    };

    DynamicItems.prototype.resetItems = function () {
      handler.selectionReady = false;
      this.numItems = 0;
      this.loadedPages = {};
      this.fetchPage_(1);
    };


    handler.dynamicItems = new DynamicItems();

  }

  getEntities(pageNumber) {
    var handler = this;

    var query = _.extend({}, {

      filter: _.extend(handler.listFilter, {
        id: {
          nin: handler.getRelationIds()
        }
      }),
      offset: (pageNumber - 1) * handler.pageSize,
      limit: handler.pageSize,
      sort: '-updated_at'
    });

    if (handler.allowedTypes && handler.allowedTypes.length) {
      query.filter.entity_type_id = {
        in: handler.allowedTypes.join(',')
      };
    }

    return handler.EntityRepository.get(query);
  }

  getRelationIds() {
    var handler = this;


    var ids = [];
    var value = handler.getValue();

    if (!handler.empty) {
      var value = handler.getValue();
      if (handler.single) {
        ids.push(value.id);
      } else {
        _.each(value.models, function (item) {
          ids.push(item.id);
        });
      }
    }

    return ids.join(',');

  }

  filterList(filter) {
    var handler = this;

    if (!filter && handler.listFilter != {}) {
      handler.listFilter = {};
      handler.dynamicItems.resetItems();
      return;
    }
    var ignoreFilter = false;
    _.each(filter, function (item, key) {
      if (handler.listFilter[key] == item) {
        ignoreFilter = true;
        return;
      }

      if (item == null) {
        delete handler.listFilter[key];
        return;
      }

      handler.listFilter[key] = item;
    });

    if (ignoreFilter) return;

    handler.dynamicItems.resetItems();

  }

  searchList(debounce) {
    var handler = this;

    if (debounce) {
      handler.debounceSearch();
      return;
    }

    handler.debounceSearch.flush();
  }

  loadRelations() {

    var handler = this;
    var value = handler.entity.getField(handler.fieldCode);
    var filter = {};

    var relationsPromise = null;
    if (!handler.empty) {

      if (handler.single) {
        filter.id = value.id;
      } else {
        var ids = [];
        _.each(value.models, function (item) {
          ids.push(item.id);
        });
        filter.id = { in: ids.join(',') };
      }

      relationsPromise = handler.EntityRepository.get({ filter: filter, include: 'attribute_set' }).then(function (results) {
        handler.relations = results;
      });
    } else {
      var defered = handler.$q.defer();
      relationsPromise = defered.promise;
      defered.resolve();
    }


    var contentModelPromise = handler.EntityTypesService.getAll().then(function (results) {
      handler.contentModels = results;
    });

    handler.$q.all([relationsPromise, contentModelPromise]).then(function () {

      handler.loadingItems = false;
    });
  }

  getRelation(model) {
    var handler = this;
    if (!handler.relations) {
      return null;
    }

    return handler.relations.findWhere({ id: model.id });
  }

  getValue() {
    var handler = this;
    return handler.entity.getField(handler.fieldCode);
  }

  setValue(value) {
    var handler = this;
    handler.entity.setField(handler.fieldCode, value);
  }

  getTitle(model) {
    if (!model) {
      return '';
    }
    var handler = this;
    var relationLocale = handler.getRelationLocale(model);

    return model.getTitle(relationLocale);
  }

  getStatus(model) {
    if (!model) {
      return '';
    }
    var handler = this;
    var contentModel = handler.contentModels.findWhere({ id: model.get('entity_type_id') });
    var workflow = contentModel.attributes.workflow;
    var status = model.get('status');
    if (_.isObject(status)) {
      var relationLocale = handler.getRelationLocale(model);
      status = status[relationLocale]
    }
    var relationLocale = handler.getRelationLocale(model);

    var workflowPoint = workflow.attributes.points.findWhere({ status: status });

    return workflowPoint.get('name');
  }

  getRelationLocale(model) {
    var handler = this;
    var status = model.get('status');
    var localeCode = (handler.locale) ? handler.locale.get('code') : 0;
    var defaultLocale = handler.locales.findWhere({ id: parseInt(handler.AppSettings.APP.DEFAULT_LOCALE) });
    var relationLocale = null;
    var relationDefaultLocale = null;
    var relationFallbackLocale = null;
    _.each(status, function (value, key) {

      if (key == localeCode) {
        relationLocale = localeCode;
      }
      if (key == defaultLocale.get('code')) {
        relationDefaultLocale = key;
      }
      relationFallbackLocale = key;
    });

    if (relationLocale) {
      return relationLocale;
    }

    if (relationDefaultLocale) {
      return relationDefaultLocale;
    }

    return relationFallbackLocale;
  }

  createNew() {
    var handler = this;
    // get content model
    var entityTypeId = handler.allowedTypes[0];
    var contentModel = false;
    var cmPromise = handler.EntityTypesService.getById(entityTypeId).then(function (type) {
      contentModel = type;
    });


    // get attribute sets
    var attributeSets = false;
    var attributeSet = false;
    var asPromise = handler.AttributeSetsService.getByType(entityTypeId).then(function (sets) {
      attributeSets = sets;
    });

    handler.$q.all([cmPromise, asPromise]).then(function () {
      // open modal for attribute set choice
      handler.ChooseSetService.choose(attributeSets, contentModel)
        .then(
          function (set) {
            attributeSet = set;
            // create form settings (model, attribute set, content model)
            var model = new handler.EntityModel();
            model.setEntityType(contentModel);
            model.setAttributeSet(attributeSet);
            var defaultPoint = contentModel.get('default_point');
            var status = defaultPoint.get('status');
            model.set('status', status);
            var formSettings = {
              model: model,
              attributeSet: attributeSet,
              contentModel: contentModel,
              scope: handler.$scope.$new()
            };

            handler.EntityQuickForm.open(formSettings).then(
              function (payload) {
                console.log('qf saved', payload);
                handler.selectedItems = [payload];
                handler.handleSelection();
              },
              function (msg) {
                console.log('qf canceled', msg);
              }
            );
          }, function () {
            return;
          }
        );
    });
  }

  addRelation() {
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

    if (!handler.selectedItems[0]) {
      handler.selectedItems = [];
      return;
    }
    if (handler.single) {
      handler.setValue(handler.selectedItems[0]);
      handler.relations.add([handler.selectedItems[0]]);
    } else {
      var value = handler.getValue();
      _.each(handler.selectedItems, function (item) {
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
    var handler = this;

    if (handler.single) {
      handler.empty = true;
      handler.setValue(null);
      return;
    }

    var value = handler.getValue();

    value.remove(model);

    if (value.models.length == 0) {
      handler.empty = true;
    }
  }
}

RelationSearchHandlerController.$inject = [
  'EntityRepository',
  'AttributeSetsService',
  'EntityTypesService',
  'EntityModel',
  'ChooseSetService',
  'EntityQuickForm',
  'AppSettings',
  'fieldTypes',
  'debounce',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$q',
  '$timeout',
];