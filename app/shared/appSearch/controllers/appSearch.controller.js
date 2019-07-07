
export default class AppSearchController{

  constructor(EntityRepository, $state, $scope, $rootScope, $element, $attrs, $timeout, $q) {

    /* jshint validthis: true */
    var vm = this;

    vm.$state = $state;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$element = $element;
    vm.$attrs = $attrs;
    vm.$timeout = $timeout;
    vm.$q = $q;

    vm.EntityRepository = EntityRepository;
    vm.EntityModel = EntityRepository.getModel();

    vm.isDisabled = false;
    vm.searchText = '';

    vm.init();
  }
  
  init() {
    // this.states = this.loadAll();
  }

  querySearch(query) {
    var self = this;

    if(query.length < 3) {
      return [];
    }
    
    var defered = self.$q.defer();

    self.EntityRepository.get({
      filter: {
        s: query,
        entity_type: {
          in: 'case,contact'
        }
      },
      include: 'fields.case_client'
    }).then(function(data){
      defered.resolve(data.models);
      return data;
    }, function(errors){
      defered.reject(errors);
      return errors;
    });
    return defered.promise;
    // var results = query ? this.states.filter( this.createFilterFor(query) ) : this.states;
    // return results;
  }

  createFilterFor(query) {
    var lowercaseQuery = query.toLowerCase();
    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }

  selectionChanged() {
    var vm = this;
    if(vm.selectedItem && vm.selectedItem instanceof vm.EntityModel) {
      if(vm.selectedItem.get('entity_type') == 'case') {
        vm.$state.go('app.cases.detail', {id: vm.selectedItem.id});
      }
      if(vm.selectedItem.get('entity_type') == 'contact'){
        vm.$state.go('app.contacts.detail', {id: vm.selectedItem.id});
      }
    }

    vm.selectedItem = null;
  }

}

AppSearchController.$inject = [
  'EntityRepository',
  '$state',
  '$scope', 
  '$rootScope', 
  '$element', 
  '$attrs', 
  '$timeout', 
  '$q'
];