/**
 * @ngdoc directive
 * @name ChooseAttributeSetService
 * @module app.shared.helpers
 *
 *
 * @usage
 *
 */

import dialogTemplate from './../views/chooseSetForNewEntityDialog.tmpl.html';

/**
 * ngInject
 */
export default function ChooseAttributeSetService($mdDialog, $q){
  return {
    choose: function(attributeSets, contentModel) {
      var chosenSet = false;
      // var stateOptions = {
      //   id: 'new',
      //   // type: dir.contentModel.get('endpoint')
      // };
      
      // if(dir.locale) {
      //   stateOptions.locale = dir.locale.get('code');
      // }  

      var ChooseSetDialogController = function($scope, $mdDialog){
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

      ChooseSetDialogController.$inject = ['$scope', '$mdDialog'];
      ChooseSetDialogController.prototype.attributeSets = attributeSets;
      ChooseSetDialogController.prototype.contentModel = contentModel;

      var defered = $q.defer();
      if(this.hasMultipleSets(attributeSets, contentModel)){
        $mdDialog.show({
          controller: ChooseSetDialogController,
          template: dialogTemplate,
          parent: angular.element(document.body),
          targetEvent: null,
          clickOutsideToClose:true
        })

        .then(function(answer) {
          console.log('modal answer', answer);
          chosenSet = answer;
          defered.resolve(chosenSet);
        }, function(error){
          defered.reject(error);
        });

        return defered.promise;
      }

      chosenSet = this.getDefaultSet();
      defered.resolve(chosenSet);
      return defered.promise;

    },

    hasMultipleSets: function(attributeSets, contentModel) {
      if(attributeSets.models.length <= 1 || !contentModel.get('multiple_sets')) {
        return false;
      }

      return true;
    },

    getDefaultSet(attributeSets, contentModel) {
      var defaultSetId = null;
      if(defaultSetId = contentModel.get('default_set_id')) {
        var defaultSet = attributeSets.findWhere({id: defaultSetId})
        if( ! defaultSet ){
          return attributeSets.models[0];
        }
        return defaultSet;
      }

      return attributeSets.models[0];
    }
  };
}

ChooseAttributeSetService.$inject = [
  '$mdDialog',
  '$q'
];