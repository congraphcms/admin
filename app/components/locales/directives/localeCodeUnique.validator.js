/**
 * @ngdoc directive
 * @name localeCodeUnique
 * @module app.components.locales
 *
 * @restrict A
 *
 */


/**
 * ngInject
 */
function ctrl($scope, $attrs, $parse) {
  this.modelGet = $parse($attrs.localeCodeUnique);
}

ctrl.$inject = [
  '$scope',
  '$attrs',
  '$parse'
];
export default function LocaleCodeUniqueValidator(LocaleRepository, $q, $parse){
  return {
    restrict: 'A',
    require: ['localeCodeUnique', '?ngModel'],
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

      ngModelCtrl.$asyncValidators.unique = function(modelValue) {
        var defered = $q.defer();
        ngModelCtrl.$loading = true;

        var model = ctrl.modelGet(scope);

        var params = {filter: {code:modelValue}};
        
        if(!model.isNew()) {
          params.filter.id = {nin: model.id};
        }

        LocaleRepository
          .get(params)
          .then(function(result){
            if(result.length) {
              defered.reject('There is already a locale with this code.');
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

LocaleCodeUniqueValidator.$inject = [
  'LocaleRepository',
  '$q',
  '$parse'
];
