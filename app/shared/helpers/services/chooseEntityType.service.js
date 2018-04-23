/**
 * @ngdoc directive
 * @name ChooseEntityTypeService
 * @module app.shared.helpers
 *
 *
 * @usage
 *
 */

import dialogTemplate from './../views/chooseEntityTypeForNewEntityDialog.tmpl.html';

/**
 * ngInject
 */
export default function ChooseEntityTypeService($mdDialog, $q){
  return {
    choose: function(entityTypes) {
      var chosenType = false;
      // var stateOptions = {
      //   id: 'new',
      //   // type: dir.contentModel.get('endpoint')
      // };
      
      // if(dir.locale) {
      //   stateOptions.locale = dir.locale.get('code');
      // }  

      var ChooseTypeDialogController = function($scope, $mdDialog){
        $scope.entityTypes = this.entityTypes;
        
        $scope.selectedType = $scope.entityTypes.models[0];
        if($scope.selectedType) {
          $scope.selectedTypeId = $scope.selectedType.id;
        }

        $scope.$watch('selectedTypeId', function(id){
          $scope.selectedType = $scope.entityTypes.findWhere({id: parseInt(id)});
        });

        $scope.cancel = function() {
          $mdDialog.cancel();
        };
        $scope.answer = function() {
          $mdDialog.hide($scope.selectedType);
        };
      };

      ChooseTypeDialogController.$inject = ['$scope', '$mdDialog'];
      ChooseTypeDialogController.prototype.entityTypes = entityTypes;

      var defered = $q.defer();
      if(this.hasMultipleTypes(entityTypes)){
        $mdDialog.show({
          controller: ChooseTypeDialogController,
          template: dialogTemplate,
          parent: angular.element(document.body),
          targetEvent: null,
          clickOutsideToClose:true
        })

        .then(function(answer) {
          chosenType = answer;
          defered.resolve(chosenType);
        }, function(error){
          defered.reject(error);
        });

        return defered.promise;
      }

      chosenType = this.getDefaultType(entityTypes);
      defered.resolve(chosenType);
      return defered.promise;

    },

    hasMultipleTypes: function(entityTypes) {
      if(entityTypes.models.length <= 1) {
        return false;
      }

      return true;
    },

    getDefaultType(entityTypes) {
      return entityTypes.models[0];
    }
  };
}

ChooseEntityTypeService.$inject = [
  '$mdDialog',
  '$q'
];