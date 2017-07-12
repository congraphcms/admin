
import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class ContentModelNewEditorController {
  constructor(
    EntityTypeRepository,
    WorkflowRepository, 
    EditorRegistry, 
    $mdDialog, 
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

    vm.EditorRegistry = 
    EditorRegistry;

    vm.EntityTypeRepository = EntityTypeRepository;
    vm.WorkflowRepository = WorkflowRepository;

    vm.workflows = [];
    vm.selectedWorkflow = null;

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

    vm.$scope.$watch('editor.model.attributes.workflow_id', function(newValue, oldValue) {

      if(newValue == oldValue) {
        return;
      }

      if( ! newValue ) {
        vm.selectedWorkflow = null;
      }

      let selectedWorkflow = vm.workflows.findWhere({id: parseInt(newValue)});
      if(selectedWorkflow) {
        vm.selectedWorkflow = selectedWorkflow;
      }
    });

    vm.deregister = vm.EditorRegistry.register(this, vm.model);

    vm.getWorkflows();

  }

  getWorkflows() {
    let vm = this;
    this.WorkflowRepository.get({include: 'points'}).then(function(result){
      vm.workflows = result;
    }, function(errors){
      throw new Error('Can\'t get workflows');
    });
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
      vm.model = result;
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

ContentModelNewEditorController.$inject = [
  'EntityTypeRepository',
  'WorkflowRepository', 
  'EditorRegistry', 
  '$mdDialog', 
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
