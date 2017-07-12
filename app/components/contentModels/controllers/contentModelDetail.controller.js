import _ from 'underscore';
import moment from 'moment';
import angular from 'angular';

export default class ContentModelDetailController {
  constructor(
    EntityTypeRepository, 
    AttributeSetRepository,
    $mdDialog, 
    $scope, 
    $rootScope, 
    $state, 
    $stateParams, 
    $element
  ) {
    /* jshint validthis: true */
    let vm = this;

    vm.$scope = $scope;
    vm.$rootScope = $rootScope;
    vm.$state = $state;
    vm.$stateParams = $stateParams;
    vm.$element = $element;

    vm.$mdDialog = $mdDialog;

    // vm.model = contentModelModel;
    
    vm.AttributeSetRepository = AttributeSetRepository;
    vm.EntityTypeRepository = EntityTypeRepository;

    vm.init();
  }

  init() {
    let vm = this;

    vm.busySets = [];
    vm.loadingModel = true;

    vm.$scope.$watch('vm.model.attributes.workflow', function(newValue, oldValue) {
      vm.workflow = newValue;
    });

    vm.$scope.$watch('vm.model.attributes.default_point', function(newValue, oldValue) {
      vm.defaultPoint = newValue;
    });

    vm.$scope.$watch('vm.model.attributes.attribute_sets', function(newValue, oldValue) {
      vm.attributeSets = newValue;
    });

    vm.getModel();
  }

  getModel() {
    let vm = this;
    vm.loadingModel = true;
    vm.EntityTypeRepository.get(
      vm.$stateParams.id, 
      {include: 'attribute_sets.attributes,workflow.points,default_point'}
    ).then(function(result){

      vm.model = result;
      vm.workflow = vm.model.attributes.workflow;
      vm.defaultPoint = vm.model.attributes.default_point;
      vm.attributeSets = vm.model.attributes.attribute_sets;
      vm.loadingModel = false;

    }, function(errors){
      vm.loadingModel = false;
      vm.modelError = true;
    });
  }

  stateActive() {
    return this.$state.is('app.contentModels.detail');
  }

  // temp 
  listDetail() {
    return this.$state.is('app.contentModels.detail');
  }

  editGeneral() {
    let vm = this;
    vm.$state.go('app.contentModelEditGeneral', {id: vm.model.id});
  }

  editWorkflow() {
    let vm = this;
    vm.$state.go('app.contentModelEditWorkflow', {id: vm.model.id});
  }

  addAttributeSet() {
    let vm = this;
    vm.$state.go('app.contentModelAttributeSet', {id: vm.model.id, setId: 'new'});
  }

  editAttributeSet(attributeSet) {
    let vm = this;
    vm.$state.go('app.contentModelAttributeSet', {id: vm.model.id, setId: attributeSet.id});
  }

  setDefaultAttributeSet(attributeSet) {
    let vm = this;

    console.log('set default attribute set: ', attributeSet.get('name'));
  }

  setBusy(attributeSet) {
    let vm = this;
    return _.indexOf(vm.busySets, attributeSet.id) != -1;
  }

  addBusySet(attributeSet) {
    let vm = this;
    if(_.indexOf(vm.busySets, attributeSet.id) == -1) {
      vm.busySets.push(attributeSet.id);
    }
  }

  removeBusySet(attributeSet) {
    let vm = this;
    let index = _.indexOf(vm.busySets, attributeSet.id);
    if(index != -1) {
      vm.busySets.splice(index, 1);
    }
  }

  deleteAttributeSet(attributeSet) {
    let vm = this;

    vm.deleteSetDialog().then(function() {
      vm.addBusySet(attributeSet);
      vm.AttributeSetRepository.delete(attributeSet).then(function(result){
        vm.attributeSets.remove(attributeSet);
        vm.removeBusySet(attributeSet);
      });
    }, function() {

    });
  }

  deleteSetDialog(ev) {
    let vm = this;
    let title = 'Delete attribute set?';
    let text = 'This will result in lost of any data that is related to this set. Do you really want to delete this attribute set?';
    let confirmDiscardDialog = 
      vm.$mdDialog.confirm()
          .parent(angular.element(document.body))
          .title(title)
          .textContent(text)
          .ariaLabel('Delete attribute set dialog')
          .targetEvent(ev)
          .ok('Delete')
          .cancel('Cancel');

    return vm.$mdDialog.show(confirmDiscardDialog);
  }
}

ContentModelDetailController.$inject = [
  'EntityTypeRepository',
  'AttributeSetRepository',
  '$mdDialog',
  '$scope',
  '$rootScope',
  '$state',
  '$stateParams',
  '$element'
];
