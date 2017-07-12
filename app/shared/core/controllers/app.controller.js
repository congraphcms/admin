

// temp
var DEBUG = true;
export default class AppController{
  constructor (
    locales,
    appSidenavService,
    $scope,
    $rootScope,
    $state,
    $timeout,
    $location
    // ngDialog,
    // entityTypes,
    // attributeSets,
    // languages
  ){

    /* jshint validthis: true */
    var vm = this;
    console.log('app ctrl loaded')
    vm.loadingState = true;
    vm.locales = locales;
    vm.appSidenavService = appSidenavService;
    vm.$location = $location;

    // models
    // vm.entityTypes = entityTypes;
    // vm.languages = languages;
    // vm.attributeSets = attributeSets;

    // group attribute_sets by entity_type.id
    // vm.groupedAttributeSets = _.groupBy(attributeSets, function(set){
    //   return set.entity_type_id;
    // });

    init();

    // Events
    // -------------------------------------------------------------------------

    // $scope.$on('entity:new', handleNewEntity);
    // function handleNewEntity(event, eventData){
    //   var entityType = eventData.entityType,
    //       locale = _.has(eventData, 'locale') ? eventData.locale : vm.defaultLanguage ,
    //       entityAtributeSets = vm.groupedAttributeSets[entityType.id];

    //   vm.chosenAttributeSetID = entityType.default_attribute_set_id || entityAtributeSets[0].id;
    //   if (entityType.multiple_sets && entityAtributeSets.length > 1) {
    //     vm.typeAttributeSets = entityAtributeSets;
    //     openMultipleSetModal(entityType, locale);
    //     return;
    //   }

    //   createNewEntity(entityType, vm.chosenAttributeSetID, locale);
    // }

    // $rootScope.$on('$stateChangeStart', handleStateChangeStart);
    // function handleStateChangeStart(event, toState, toParams, fromState, fromParams){
    //   // event.preventDefault();
    //   // transitionTo() promise will be rejected with
    //   // a 'transition prevented' error

    //   showLoader();
    // }

    $rootScope.$on('$stateNotFound', handleStateNotFound);
    function handleStateNotFound(event, unfoundState, fromState, fromParams) {
      DEBUG && console.error('$stateNotFound');
    }

    $rootScope.$on('$stateChangeSuccess', handleStateChangeSuccess);
    function handleStateChangeSuccess(event, toState, toParams, fromState, fromParams) {
      vm.appSidenavService.close();
      DEBUG && console.log('$stateChangeSuccess', toState, fromState);
      // window.ga('send', 'pageview', vm.$location.path());
    }

    $rootScope.$on('$stateChangeError', handleStateChangeError);
    function handleStateChangeError(event, toState, toParams, fromState, fromParams, error) {
      console.error('$stateChangeError');
      if ( DEBUG ){
        console.log(event, 'event');
        console.log(toState, 'toState');
        console.log(toParams, 'toParams');
        console.log(fromState, 'fromState');
        console.log(fromParams, 'fromParams');
        console.log(error, 'error');
      }
    }

    $rootScope.$on('$viewContentLoading', handleViewContentLoading);
    function handleViewContentLoading(event, viewConfig) {
      /**
       * Access to all the view config properties.
       * and one special property 'targetView'
       * viewConfig.targetView
       */
    }

    $scope.$on('$viewContentLoaded', handleViewContentLoaded);
    function handleViewContentLoaded(event) {
      hideLoader();
    }


    // Functions
    // -------------------------------------------------------------------------
    function init() {

      DEBUG && console.log('AppController init');
      // var defaultLanguage = _.find(vm.languages, function(lang){
      //   return lang.default;
      // });

      // vm.defaultLanguage = _.isUndefined(defaultLanguage) ? vm.languages[0] : defaultLanguage;
    }



    // function createNewEntity(entityType, attributeSetId, locale) {
    //   var data = {
    //     type: entityType.slug,
    //     locale: locale.code,
    //   };
    //   if (attributeSetId) {
    //     data['attribute-set'] = attributeSetId;
    //   }
    //   $state.go('app.posts.add', data);
    // }

    // function openMultipleSetModal(entityType, locale) {
    //   ngDialog.openConfirm({
    //     template: CB.admin_assets_url + '/js/app/main/templates/multiple-set-modal.html',
    //     scope: $scope
    //   }).then(function(data){
    //     createNewEntity(entityType, vm.chosenAttributeSetID, locale);
    //   });
    // }

    function showLoader(){
      angular.element(document.getElementById('appLoader')).removeClass('done');
    }

    function hideLoader(){
      $timeout(function(){
        angular.element(document.getElementById('appLoader')).addClass('done');
      }, 200);
    }

  }
}

// contoller dependencies
AppController.$inject = [
  'locales',
  'appSidenavService',
  '$scope',
  '$rootScope',
  '$state',
  '$timeout',
  '$location'
  // 'ngDialog',
  // 'entityTypes',
  // 'attributeSets',
  // 'languages'
];
