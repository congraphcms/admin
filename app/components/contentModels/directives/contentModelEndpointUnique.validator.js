/**
 * @ngdoc directive
 * @name contentModelEndpointUnique
 * @module app.components.contentModel
 *
 * @restrict A
 */

/**
 * ngInject
 */
export default function ContentModelEndpointUniqueValidator(EntityTypeRepository, $q, $parse){
  return {
    restrict: 'A',
    require: ['contentModelEndpointUnique', '?ngModel'],
    compile: compile,
    controller: ctrl
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

        let params = {filter: {endpoint:modelValue}};
        
        if(!model.isNew()) {
          params.filter.id = {nin: model.id};
        }

        EntityTypeRepository
          .get(params)
          .then(function(result){
            if(result.length) {
              defered.reject('Content model endpoint is already taken');
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
    this.modelGet = $parse($attrs.contentModelEndpointUnique);
  }

  ctrl.$inject = [
    '$scope',
    '$attrs'
  ];
}

ContentModelEndpointUniqueValidator.$inject = [
  'EntityTypeRepository',
  '$q',
  '$parse'
];
