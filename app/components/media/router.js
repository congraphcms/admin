import listingTemplate from './views/mediaListing.tmpl.html';
// import formTemplate from './views/attributeForm.tmpl.html';

export default function MediaRouterConfig($stateProvider) {
  
  $stateProvider
    .state('app.media', {
      url: '/media',
      template: listingTemplate,
      requireAuth: true,
      controller: 'MediaListingController',
      controllerAs: 'vm'
    })

    // .state('app.attributes.new', {
    //   url: '/new', 
    //   template: formTemplate,
    //   requireAuth: true,
    //   controller: 'AttributeFormController',
    //   controllerAs: 'vm',
    //   resolve: {
    //     attributeModel : resolveNewAttributeModel,
    //     contentModel: resolveContentModel_fake,
    //     attributeSet: resolveAttributeSetModel_fake
    //   }
    // })

    // .state('app.attributes.edit', {
    //   url: '/:id', 
    //   template: formTemplate,
    //   requireAuth: true,
    //   controller: 'AttributeFormController',
    //   controllerAs: 'vm',
    //   resolve: {
    //     attributeModel : resolveAttributeModel,
    //     contentModel: resolveContentModel_fake,
    //     attributeSet: resolveAttributeSetModel_fake
    //   }
    // });
}

MediaRouterConfig.$inject = [
  '$stateProvider'
];