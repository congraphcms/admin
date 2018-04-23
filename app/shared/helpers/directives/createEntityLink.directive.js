/**
 * @ngdoc directive
 * @name createEntityLink
 * @module app.shared.helpers
 *
 * @restrict A
 *
 * @description
 * `<button create-entity-link></button>`.
 *
 * @usage
 *
 */

import dialogTemplate from './../views/chooseSetForNewEntityDialog.tmpl.html';
/**
 * ngInject
 */
export function createEntityLink(){
  return {
    restrict: 'A',
    scope: {
      attributeSets: "=",
      contentModel: "=",
      locale: "=?"
    },
    controller: 'CreateEntityLinkController',
    controllerAs: 'dir',
    bindToController: true,
    compile: compile
  };

  function compile(templateElement) {

    return link;
  }

  function link(scope, element, attrs, ctrls) {

  }
}

createEntityLink.$inject = [];

export class CreateEntityLinkController{

  constructor($mdDialog, $state, $scope, $element) {
    var dir = this;

    dir.$mdDialog = $mdDialog;
    dir.$state = $state;
    dir.$scope = $scope;
    dir.$element = $element;
    
    $element.bind("click", angular.bind(dir, dir.createNewEntity));

  }

  hasMultipleSets() {
    var dir = this;

    if(dir.attributeSets.models.length <= 1 || !dir.contentModel.get('multiple_sets')) {
      return false;
    }

    return true;
  }

  getDefaultSet() {
    var dir = this;
    var defaultSetId = null;
    if(defaultSetId = dir.contentModel.get('default_set_id')) {
      var defaultSet = dir.attributeSets.findWhere({id: defaultSetId})
      if( ! defaultSet ){
        return dir.attributeSets.models[0];
      }
      return defaultSet;
    }

    return dir.attributeSets.models[0];
  }

  createNewEntity(event) {
    var dir = this;
    
    var stateOptions = {};
    if(dir.locale) {
      stateOptions.locale = dir.locale.get('code');
    }  

    var ChooseSetForNewEntityDialogController = function($scope, $mdDialog){
      $scope.attributeSets = this.attributeSets;
      $scope.contentModel = this.contentModel;
      var defaultSetId = null;
      if(defaultSetId = $scope.contentModel.get('default_set_id')) {
        $scope.selectedSet = $scope.attributeSets.findWhere({id: defaultSetId});
        if($scope.selectedSet) {
          $scope.selectedSetId = $scope.selectedSet.id;
        }
      } else {
        $scope.selectedSet = $scope.attributeSets.models[0];
        if($scope.selectedSet) {
          $scope.selectedSetId = $scope.selectedSet.id;
        }
      }

      $scope.$watch('selectedSetId', function(id){
        $scope.selectedSet = $scope.attributeSets.findWhere({id: parseInt(id)});
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function() {
        $mdDialog.hide($scope.selectedSet);
      };
    };

    ChooseSetForNewEntityDialogController.$inject = ['$scope', '$mdDialog'];
    ChooseSetForNewEntityDialogController.prototype.attributeSets = dir.attributeSets;
    ChooseSetForNewEntityDialogController.prototype.contentModel = dir.contentModel;


    if(dir.hasMultipleSets()){
      dir.$mdDialog.show({
        controller: ChooseSetForNewEntityDialogController,
        template: dialogTemplate,
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true
      })
      .then(function(answer) {
        stateOptions.attributeSet = answer.get('code');
        dir.$state.go('app.entities.type.new', stateOptions);
      });

      return;
    }

    stateOptions.attributeSet = dir.getDefaultSet().get('code');
    dir.$state.go('app.entities.type.new', stateOptions);  
  }
}

CreateEntityLinkController.$inject = [
  '$mdDialog',
  '$state',
  '$scope',
  '$element'
];