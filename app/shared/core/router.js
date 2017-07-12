import template from './views/layout.tmpl.html';

export default function CoreRouterConfig($stateProvider){

  $stateProvider
    .state('app', {
      abstract: true,
      template: template,
      requireAuth: true,
      controller: 'AppController',
      // controllerAs: 'appCtrl',
      // 
      // 

      resolve: {
        allContentTypes: resolveContentTypes,
        allAttributeSets: resolveAttributeSets,
        attributes: resolveAttributes,
        locales: resolveLocales,
        defaultLocale: resolveDefaultLocale,

        // messageManager: resolveMessageManager,
        // attributeSets : resolveAttributeSets
      }
    });
}

CoreRouterConfig.$inject = ['$stateProvider'];

function resolveContentTypes(EntityTypesService) {
  return EntityTypesService.getAll();
}
resolveContentTypes.$inject = [
  'EntityTypesService'
];

function resolveAttributeSets(AttributeSetsService) {
  return AttributeSetsService.getAll();
}
resolveAttributeSets.$inject = [
  'AttributeSetsService'
];

function resolveAttributes(AttributesService) {
  return AttributesService.getAll();
}
resolveAttributes.$inject = [
  'AttributesService'
];

function resolveLocales(LocalesService){
    return LocalesService.getAll();
}

resolveLocales.$inject = ['LocalesService'];

function resolveDefaultLocale(locales, AppSettings){
  var defaultLocale = locales.findWhere({id: parseInt(AppSettings.APP.DEFAULT_LOCALE)});
  return defaultLocale;
}

resolveDefaultLocale.$inject = ['locales', 'AppSettings'];
