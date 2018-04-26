/**
 * @ngdoc directive
 * @name entityFieldUnique
 * @module app.components.entity
 *
 * @restrict A
 *
 * @description
 * `<input entity-field-unique />`.
 *
 * @usage
 *
 */


/**
 * ngInject
 */
function ctrl($scope, $attrs, $parse) {
  this.modelGet = $parse($attrs.entityFieldUnique);
  this.attributeGet = $parse($attrs.entityFieldAttribute);
}

ctrl.$inject = [
  '$scope',
  '$attrs',
  '$parse'
];
export default function EntityFieldUniqueValidator(EntityRepository, $q, $parse){

  return {
    restrict: 'A',
    require: ['entityFieldUnique', '?ngModel'],
    compile: compile,
    controller: ctrl
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    // only apply the validator if ngModel is present

    var ctrl = ctrls[0];
    var ngModelCtrl = ctrls[1];

    if (ngModelCtrl && ngModelCtrl.$validators) {

      // this will overwrite the default Angular email validator
      ngModelCtrl.$asyncValidators.unique = function(modelValue) {
        var defered = $q.defer();
        ngModelCtrl.$loading = true;

        var attribute = ctrl.attributeGet(scope);
        var model = ctrl.modelGet(scope);

        if(!attribute.get('unique')) {
          defered.resolve('');
          return defered.promise;
        }
        var filterKey = 'fields.' + attribute.get('code');

        var params = {filter: {}};

        params.filter[filterKey] = modelValue;
        
        if(!model.isNew()) {
          params.filter.id = {nin: model.id};
        }

        EntityRepository
          .get(params)
          .then(function(result){
            if(result.length) {
              defered.reject(attribute.get('label') + ' is already taken');
              return result;
            }
            defered.resolve('');
            return result;
          }, function(result){
            defered.resolve('');
            return result;
          })
          .finally(function(result){
            ngModelCtrl.$loading = false;
            return result;
          });

        return defered.promise;
      };
    }
  }

}

EntityFieldUniqueValidator.$inject = [
  'EntityRepository',
  '$q',
  '$parse'
];
