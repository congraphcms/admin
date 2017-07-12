


export default class AppSidenavController{

  constructor (
    LocalesService,
    EntityTypesService,
    EntityTypeRepository, 
    appSidenavService, 
    $scope, 
    $rootScope, 
    $state, 
    $element, 
    $attrs, 
    $q, 
    $timeout
  ) {

    /* jshint validthis: true */
    let vm = this;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$element = $element;
    vm.$attrs = $attrs;
    vm.$q = $q;
    vm.$timeout = $timeout;
    vm.EntityTypeRepository = EntityTypeRepository;
    vm.appSidenavService = appSidenavService;
    vm.LocalesService = LocalesService;
    
    vm.handle = 'appSidenav';

    vm.EntityTypesService = EntityTypesService;

  }

  typeOk(entityTypeModel) {
    let vm = this;

    return vm.hasAttributeSets(entityTypeModel) && !vm.needLocales(entityTypeModel);
  }

  hasAttributeSets(entityTypeModel) {
    let vm = this;
    let attribute_sets = entityTypeModel.attributes.attribute_sets;
    return attribute_sets && attribute_sets.models && attribute_sets.models.length > 0;
  }

  needLocales(entityTypeModel) {
    let vm = this;
    if(!entityTypeModel.attributes.localized) {
      return false;
    }

    if(vm.localesCollection === null) {
      return false;
    }

    return vm.locales.length == 0;
  }

  goToEntityList(entityTypeModel) {
    let vm = this;
    if(!vm.typeOk(entityTypeModel)){
      return;
    }
    vm.$state.go('app.entities.type', {type: entityTypeModel.attributes.endpoint})
  }

  getWarningTooltip(entityTypeModel) {
    let vm = this;
    if(vm.typeOk(entityTypeModel)){
      return '';
    }
    if(!vm.hasAttributeSets(entityTypeModel)) {
      return 'There are no attribute sets for this type.';
    }

    if(vm.needLocales(entityTypeModel)) {
      return 'There are no locales.';
    }
  }

  /**
   * Called by our linking fn to provide access to the menu-content
   * element removed during link
   */
  init() {
    let vm = this;

    vm.entityTypesCollection = null;
    vm.entityTypes = [];

    vm.EntityTypesService.getAll().then(function(data){
      vm.entityTypesCollection = data;
      vm.entityTypes = vm.entityTypesCollection.models;
    });

    vm.localesCollection = null;
    vm.locales = [];

    vm.LocalesService.getAll().then(function(data){
      vm.localesCollection = data;
      vm.locales = vm.localesCollection.models;
    });
  }
}

AppSidenavController.$inject = [
  'LocalesService',
  'EntityTypesService',
  'EntityTypeRepository',
  'appSidenavService',
  '$scope', 
  '$rootScope',
  '$state',
  '$element', 
  '$attrs', 
  '$q',
  '$timeout'
];
