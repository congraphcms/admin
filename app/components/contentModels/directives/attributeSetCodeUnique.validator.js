/**
 * @ngdoc directive
 * @name attributeSetCodeUnique
 * @module app.components.contentModel
 *
 * @restrict A
 */


/**
 * ngInject
 */
class Ctrl{
  constructor($scope, $attrs, $parse) {
    this.modelGet = $parse($attrs.attributeSetCodeUnique);
  }
}

Ctrl.$inject = [
  '$scope',
  '$attrs',
  '$parse'
];
export default function AttributeSetCodeUniqueValidator(AttributeSetRepository, $q, $parse){
  return {
    restrict: 'A',
    require: ['attributeSetCodeUnique', '?ngModel'],
    compile: compile,
    controller: Ctrl
  };

  function compile(templateElement) {
    // templateElement.addClass('md-menu');
    return link;
  }

  function link(scope, element, attrs, ctrls) {
    // only apply the validator if ngModel is present

    let ctrl = ctrls[0];
    let ngModelCtrl = ctrls[1];

    if (ngModelCtrl && ngModelCtrl.$validators) {

      // this will overwrite the default Angular email validator
      ngModelCtrl.$asyncValidators.unique = function(modelValue) {
        let defered = $q.defer();
        ngModelCtrl.$loading = true;

        let model = ctrl.modelGet(scope);

        let params = {filter: {code:modelValue}};
        
        if(!model.isNew()) {
          params.filter.id = {nin: model.id};
        }

        AttributeSetRepository
          .get(params)
          .then(function(result){
            if(result.length) {
              defered.reject('Attribute set code is already taken');
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

AttributeSetCodeUniqueValidator.$inject = [
  'AttributeSetRepository',
  '$q',
  '$parse'
];