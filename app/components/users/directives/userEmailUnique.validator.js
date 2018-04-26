/**
 * @ngdoc directive
 * @name userEmailUnique
 * @module app.components.users
 *
 * @restrict A
 */

/**
 * ngInject
 */
function ctrl($scope, $attrs, $parse) {
  this.modelGet = $parse($attrs.userEmailUnique);
}

ctrl.$inject = [
  '$scope',
  '$attrs',
  '$parse'
];


export default function UserEmailUniqueValidator(UserRepository, $q, $parse){
  return {
    restrict: 'A',
    require: ['userEmailUnique', '?ngModel'],
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

        var model = ctrl.modelGet(scope);

        var params = {filter: {email:modelValue}};
        
        if(!model.isNew()) {
          params.filter.id = {nin: model.id};
        }

        UserRepository
          .get(params)
          .then(function(result){
            if(result.length) {
              defered.reject('There is already a user with this email.');
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

UserEmailUniqueValidator.$inject = [
  'UserRepository',
  '$q',
  '$parse'
];
