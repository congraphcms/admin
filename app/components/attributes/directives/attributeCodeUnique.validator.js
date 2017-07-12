/**
 * @ngdoc directive
 * @name attributeCodeUnique
 * @module app.components.attributes
 *
 * @restrict A
 *
 */


/**
 * ngInject
 */
export default function AttributeCodeUnique(AttributeRepository, $q, $parse){
  return {
    restrict: 'A',
    require: ['AttributeCodeUnique', '?ngModel'],
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

        var params = {filter: {code:modelValue}};
        
        if(!model.isNew()) {
          params.filter.id = {nin: model.id};
        }

        AttributeRepository
          .get(params)
          .then(function(result){
            if(result.length) {
              defered.reject('Attribute code is already taken');
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

  function ctrl($scope, $attrs) {
    this.modelGet = $parse($attrs.AttributeCodeUnique);
  }

  ctrl.$inject = [
    '$scope',
    '$attrs'
  ];
}

AttributeCodeUnique.$inject = [
  'AttributeRepository',
  '$q',
  '$parse'
];
