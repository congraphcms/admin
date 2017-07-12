import listingTemplate from './views/entityListing.tmpl.html';
import formTemplate from './views/entityForm.tmpl.html';

export default function EntitiesRouterConfig($stateProvider) {
  
  $stateProvider
    .state('app.entities', {
      url: '/entities',
      template: '<div ui-view layout="column" flex ></div>',
      abstract: true, 
      requireAuth: true
    })
  
    .state('app.entities.type', {
      url: '/:type?listingLocale',
      template: listingTemplate,
      requireAuth: true,
      controller: 'EntityListingController',
      controllerAs: 'vm',
      resolve: {
        contentModel: resolveContentModel,
        attributeSets: resolveAttributeSets
      }
    })

    .state('app.entities.type.new', {
      url: '/new?attributeSet&locale', 
      template: formTemplate,
      requireAuth: true,
      controller: 'EntityFormController',
      controllerAs: 'vm',
      resolve: {
        entityModel: resolveNewEntityModel,
        attributeSet: resolveNewEntityAttributeSet,
      }
    })

    .state('app.entities.type.edit', {
      url: '/:id?locale', 
      template: formTemplate,
      requireAuth: true,
      controller: 'EntityFormController',
      controllerAs: 'vm',
      resolve: {
        entityModel: resolveEntityModel,
        attributeSet: resolveEntityAttributeSet
      }
    });
}

EntitiesRouterConfig.$inject = [
  '$stateProvider'
];

function resolveContentModel(allContentTypes, $stateParams) {

  var contentModel = allContentTypes.findWhere({endpoint:$stateParams.type})
  return contentModel;
}

resolveContentModel.$inject = [
  'allContentTypes',
  '$stateParams'
];


function resolveAttributeSets(contentModel, allAttributeSets, AttributeSetCollection) {

  var sets = allAttributeSets.where({entity_type_id: contentModel.id});
  var collection = new AttributeSetCollection(sets);

  return collection;
}

resolveAttributeSets.$inject = [
  'contentModel',
  'allAttributeSets',
  'AttributeSetCollection'
];


function resolveNewEntityModel(contentModel, defaultLocale, locales, EntityRepository, $stateParams) {

  var entityModel;

  entityModel = EntityRepository.newModel();
  entityModel.setEntityType(contentModel);

  if(contentModel.get('localized')) {
    if( ! $stateParams.locale || ! locales.findWhere({code: $stateParams.locale}) ) {
      $stateParams.locale = defaultLocale.get('code');
    }

    entityModel.set('locale', $stateParams.locale);
  }

  var defaultPoint = contentModel.get('default_point');
  var status = defaultPoint.get('status');

  entityModel.set('status', status);

  return entityModel;
}

resolveNewEntityModel.$inject = [
  'contentModel',
  'defaultLocale',
  'locales',
  'EntityRepository',
  '$stateParams'
];


function resolveNewEntityAttributeSet(entityModel, contentModel, attributeSets, $stateParams, $q) {

  var defered = $q.defer();
  var attributeSet;

  attributeSet = attributeSets.findWhere({code: $stateParams.attributeSet});

  if( ! attributeSet ) {
    var defaultSetId = contentModel.get('default_set_id');
    if(defaultSetId) {
      var defaultSet = attributeSets.findWhere({id: defaultSetId});
      if( ! defaultSet ){
        attributeSet = attributeSets.models[0];
      }
      attributeSet = defaultSet;
    } else {
      attributeSet = attributeSets.models[0];
    }
  }

  entityModel.setAttributeSet(attributeSet);

  return attributeSet;
}

resolveNewEntityAttributeSet.$inject = [
  'entityModel',
  'contentModel',
  'attributeSets',
  '$stateParams',
  '$q'
];


function resolveEntityModel(contentModel, defaultLocale, locales, EntityRepository, $stateParams) {

  if( ! $stateParams.locale || ! locales.findWhere({code: $stateParams.locale}) ) {
    $stateParams.locale = defaultLocale.get('code');
  }

  return EntityRepository.get(
      $stateParams.id, 
      {locale: $stateParams.locale}
    )
    .then(function(model){
      model.setEntityType(contentModel);
      if(model.get('status') == null) {
        var defaultPoint = contentModel.get('default_point');
        var status = defaultPoint.get('status');
        model.set('status', status);
      }
      return model;
    });
}

resolveEntityModel.$inject = [
  'contentModel',
  'defaultLocale',
  'locales',
  'EntityRepository',
  '$stateParams'
];


function resolveEntityAttributeSet(entityModel, contentModel, attributeSets, $stateParams, $q) {

  var defered = $q.defer();
  var attributeSet;
  if( ! entityModel.isNew() ) {
    attributeSet = attributeSets.findWhere({id: entityModel.get('attribute_set_id')});
    if( ! attributeSet ) {
      defered.reject('Invalid attribute set.');
    } else {
      entityModel.setAttributeSet(attributeSet);
      defered.resolve(attributeSet);
    }

    return defered.promise;
  }
}

resolveEntityAttributeSet.$inject = [
  'entityModel',
  'contentModel',
  'attributeSets',
  '$stateParams',
  '$q'
];

