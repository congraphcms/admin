import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class ContentModelGeneralEditorController {
  constructor(
    EntityTypeRepository, 
    EditorRegistry,
    $scope, 
    $rootScope, 
    $state, 
    $stateParams, 
    $element,
    $attrs, 
    $q, 
    $timeout, 
    $compile
  ) {

  /* jshint validthis: true */
  let vm = this;

  vm.form = $element.controller('form');

  vm.$attrs = $attrs;
  vm.$element = $element;
  vm.$scope = $scope;
  vm.$rootScope = $rootScope;
  vm.$state = $state;
  vm.$q = $q;
  vm.$timeout = $timeout;
  vm.$compile = $compile;

  vm.EditorRegistry = EditorRegistry;

  vm.EntityTypeRepository = EntityTypeRepository;

  vm.init();
}

  init() {
    let vm = this;

    vm.$scope.$watch('editor.form.$pending', function(newValue) {
      if(newValue == undefined) {
        vm.busy = false;
      } else {
        vm.busy = true;
      }
    });

    vm.deregister = vm.EditorRegistry.register(this, vm.model);

  }


  isNew() {
    return this.model.isNew();
  }

  save() {
    let vm = this;
    
    vm.form.$setDirty(true);
    vm.form.$setSubmitted(true);

    if(vm.form.$invalid) {

      let defered = vm.$q.defer();
      defered.reject({error: "Invalid form"});
      return defered.promise;
    }

    vm.busy = true;

    let promise = vm.EntityTypeRepository.save(vm.model);

    promise.then(function(result){


      vm.deregister();
      vm.deregister = vm.EditorRegistry.register(vm, result);

      vm.busy = false;
      vm.form.$setDirty(false);
      vm.form.$setPristine(true);
      return result;

    }, function(errors){
      console.error("SAVE ENTITY TYPE ERROR", errors);

      vm.busy = false;

      return errors;
    });

    return promise;
  }
}
ContentModelGeneralEditorController.$inject = [
  'EntityTypeRepository', 
  'EditorRegistry',
  '$scope', 
  '$rootScope', 
  '$state', 
  '$stateParams', 
  '$element',
  '$attrs', 
  '$q', 
  '$timeout', 
  '$compile'
];
