import listingTemplate from './views/localeListing.tmpl.html';
import formTemplate from './views/localeForm.tmpl.html';

export default function LocalesRouterConfig($stateProvider) {
  
  $stateProvider
    .state('app.locales', {
      url: '/locales',
      template: listingTemplate,
      requireAuth: true,
      controller: 'LocaleListingController',
      controllerAs: 'vm'
    })

    .state('app.locales.new', {
      url: '/new', 
      template: formTemplate,
      requireAuth: true,
      controller: 'LocaleFormController',
      controllerAs: 'vm',
      resolve: {
        localeModel : resolveNewLocaleModel
      }
    })

    .state('app.locales.edit', {
      url: '/:id', 
      template: formTemplate,
      requireAuth: true,
      controller: 'LocaleFormController',
      controllerAs: 'vm',
      resolve: {
        localeModel : resolveLocaleModel
      }
    });
}

LocalesRouterConfig.$inject = [
  '$stateProvider'
];

function resolveNewLocaleModel(LocaleRepository) {
  return LocaleRepository.newModel();
}

resolveNewLocaleModel.$inject = [
  'LocaleRepository'
];

function resolveLocaleModel(LocaleRepository, $stateParams) {

  // @todo check / validate id
  var model = LocaleRepository.get($stateParams.id); // returns promise
  return model;
}

resolveLocaleModel.$inject = [
  'LocaleRepository',
  '$stateParams'
];