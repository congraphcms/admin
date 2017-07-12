import listingTemplate from './views/contentModelListing.tmpl.html';
import detailTemplate from './views/contentModelDetail.tmpl.html';
import generalFormTemplate from './views/contentModelGeneralForm.tmpl.html';
import newFormTemplate from './views/contentModelNewForm.tmpl.html';
import workflowFormTemplate from './views/contentModelWorkflowForm.tmpl.html';
import attributeSetFormTemplate from './views/attributeSetForm.tmpl.html';
import attributeFormTemplate from './../attributes/views/attributeForm.tmpl.html';

export default function ContentModelRouterConfig($stateProvider) {
  
  $stateProvider
    .state('app.contentModels', {
      url: '/content-models',
      template: listingTemplate,
      requireAuth: true,
      controller: 'ContentModelListingController',
      controllerAs: 'vm'
    })

    .state('app.contentModelNew', {
      url: '/content-models/new',
      template: newFormTemplate,
      requireAuth: true,
      controller: 'ContentModelNewFormController',
      controllerAs: 'vm',
      resolve: {
        contentModel: resolveNewContentModel
      }
    })

    .state('app.contentModels.detail', {
      url: '/:id',
      template: detailTemplate,
      requireAuth: true,
      controller: 'ContentModelDetailController',
      controllerAs: 'vm'
    })

    .state('app.contentModelEditGeneral', {
      url: '/content-models/:id/edit-general',
      template: generalFormTemplate,
      requireAuth: true,
      controller: 'ContentModelGeneralFormController',
      controllerAs: 'vm',
      resolve: {
        contentModel: resolveContentModel
      }
    })

    .state('app.contentModelEditWorkflow', {
      url: '/content-models/:id/edit-workflow',
      template: workflowFormTemplate,
      requireAuth: true,
      controller: 'ContentModelWorkflowFormController',
      controllerAs: 'vm',
      resolve: {
        contentModel: resolveContentModel
      }
    })

    .state('app.contentModelAttributeSet', {
      url: '/content-models/:id/attribute-sets/:setId',
      template: attributeSetFormTemplate,
      requireAuth: true,
      controller: 'AttributeSetFormController',
      controllerAs: 'vm',
      resolve: {
        contentModel: resolveContentModel,
        attributeSet: resolveAttributeSet,
        attributes: resolveAttributes
      }
    })

    .state('app.contentModelAttributeSet.attribute', {
      url: '/attributes/:attributeId',
      template: attributeFormTemplate,
      requireAuth: true,
      controller: 'AttributeFormController',
      controllerAs: 'vm',
      resolve: {
        attributeModel: resolveAttributeModel
      }
    });
}

ContentModelRouterConfig.$inject = [
  '$stateProvider'
];


function resolveContentModel(EntityTypeRepository, $stateParams) {
  return EntityTypeRepository.get($stateParams.id, {include: 'attribute_sets.attributes,workflow.points,default_point'});
}

resolveContentModel.$inject = [
  'EntityTypeRepository',
  '$stateParams'
];

function resolveNewContentModel(EntityTypeRepository) {
  return EntityTypeRepository.newModel();
}

resolveNewContentModel.$inject = [
  'EntityTypeRepository'
];

function resolveAttributeSet(contentModel, AttributeSetRepository, $stateParams) {
  if($stateParams.setId == 'new') {
    return AttributeSetRepository.newModel();
  }

  var attributeSets = contentModel.get('attribute_sets');
  var attributeSet = attributeSets.findWhere({id: parseInt($stateParams.setId)});

  return attributeSet;
}

resolveAttributeSet.$inject = [
  'contentModel',
  'AttributeSetRepository',
  '$stateParams'
];

function resolveAttributes(AttributeRepository) {
  return AttributeRepository.get();
}

resolveAttributes.$inject = [
  'AttributeRepository'
];

function resolveAttributeModel(attributes, AttributeRepository, $stateParams) {
  if($stateParams.attributeId == 'new') {
    return AttributeRepository.newModel();
  }

  var attribute = attributesCollection.findWhere({id: parseInt($stateParams.attributeId)});

  return attribute;
}

resolveAttributeModel.$inject = [
  'attributes',
  'AttributeRepository',
  '$stateParams'
];
