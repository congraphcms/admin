import listingTemplate from './views/attributeListing.tmpl.html';
import formTemplate from './views/attributeForm.tmpl.html';

export default function AttributesRouterConfig($stateProvider) {
  
  $stateProvider
    .state('app.attributes', {
      url: '/attributes',
      template: listingTemplate,
      requireAuth: true,
      controller: 'AttributeListingController',
      controllerAs: 'vm'
    })

    .state('app.attributes.new', {
      url: '/new', 
      template: formTemplate,
      requireAuth: true,
      controller: 'AttributeFormController',
      controllerAs: 'vm',
      resolve: {
        attributeModel : resolveNewAttributeModel,
        contentModel: resolveContentModel_fake,
        attributeSet: resolveAttributeSetModel_fake
      }
    })

    .state('app.attributes.edit', {
      url: '/:id', 
      template: formTemplate,
      requireAuth: true,
      controller: 'AttributeFormController',
      controllerAs: 'vm',
      resolve: {
        attributeModel : resolveAttributeModel,
        contentModel: resolveContentModel_fake,
        attributeSet: resolveAttributeSetModel_fake
      }
    });
}

AttributesRouterConfig.$inject = [
  '$stateProvider'
];

function resolveNewAttributeModel(AttributeRepository, $stateParams) {
  return AttributeRepository.newModel();
}

resolveNewAttributeModel.$inject = [
  'AttributeRepository',
  '$stateParams'
];

function resolveAttributeModel(AttributeRepository, $stateParams) {

  // @todo check / validate id
  var model = AttributeRepository.get($stateParams.id); // returns promise
  return model;
}

resolveAttributeModel.$inject = [
  'AttributeRepository',
  '$stateParams'
];

function resolveContentModel_fake() {
  return false;
}

resolveContentModel_fake.$inject = [];

function resolveAttributeSetModel_fake() {
  return false;
}

resolveAttributeSetModel_fake.$inject = [];

function resolveAttributesCollection_fake() {
  return false;
}

resolveAttributesCollection_fake.$inject = [];

