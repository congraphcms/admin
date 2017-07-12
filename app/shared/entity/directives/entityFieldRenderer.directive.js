/**
 * @ngdoc directive
 * @name entityFieldRenderer
 * @module app.components.entity
 *
 * @restrict E
 *
 * @description
 * `<entity-field-renderer></entity-field-renderer>`.
 *
 * @usage
 *
 */

export default EntityFieldRenderer;

/**
 * ngInject
 */
function EntityFieldRenderer(fieldTypes, $compile){
  return {
    restrict: 'E',
    template: '',
    scope: {
      entity: "=",
      attribute: "=",
      locale: "=",
      locales: "="
    },
    // controller: 'EntityFieldWalkerController',
    // controllerAs: 'walker',
    // bindToController: true,
    compile: compile
  };

  function compile(templateElement) {
    return {
      pre: preLink,
      post: postLink
    };
  }

  function preLink(scope, element, attrs, ctrls) {

  }

  function postLink(scope, element, attrs, ctrls) {
    var input_type;
    if(!scope.attribute.attributes.data || !scope.attribute.attributes.data.input_type){
      input_type = fieldTypes[scope.attribute.attributes.field_type].default_input;
    } else {
      input_type = scope.attribute.attributes.data.input_type
    }

    var name = input_type.split('_');
    name = name.join('-');
    var html = '<'+name+'-handler entity="entity" attribute="attribute" locale="locale" locales="locales">'+name+'-handler not compiled...</'+name+'-handler>';
    
    var input = angular.element(html);
    

    // // Step 1: parse HTML into DOM element
    // var template = angular.element(html);

    // // Step 2: compile the template
    // var linkFn = $compile(template);

    // // Step 3: link the compiled template with the scope.
    // var input = linkFn(scope);

    // Step 4: Append to DOM (optional)
    
    element.empty().append(input);

    $compile(input)(scope);
  }
}

EntityFieldRenderer.$inject = [
  'fieldTypes',
  '$compile'
];