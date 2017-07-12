
/**
 * @ngdoc module
 * @name material.components.field
 *
 * @description
 * Field components.
 */

export default FieldDirective;

/**
 * @ngdoc directive
 * @name cbField
 * @module material.components.field
 *
 * @restrict E
 *
 * @description
 * The `<cb-field>` directive is a container element used within `<md-content>` containers.
 *
 * Action buttons can be included in an `<cb-field-actions>` element, similar to `<md-card-actions>`.
 * You can then position buttons using layout attributes.
 *
 * Field is built with:
 * * `<cb-field-title>` - Field title
 *  - `<md-card-title-text>`
 *    - `cb-headline` - Class for the field title
 *    - `cb-subhead` - Class for the field subtitle
 * * `<cb-field-input>` - Field input control
 * * `<cb-field-actions>` - Field actions
 *  - `<cb-field-icon-actions>` - Icon actions
 *
 *
 * @usage
 * ### Field with simple input
 * <hljs lang="html">
 * <cb-field>
 *  <cb-field-title>
 *    <h2>Field Name</h2>
 *    <p>Short description of the field</p>
 *  </cb-field-title>
 *  <cb-field-input>
 *    
 *  </cb-field-input>
 *  <cb-field-actions>
 *    <md-button>Action 1</md-button>
 *    <md-button>Action 2</md-button>
 *  </cb-field-actions>
 * </cb-field>
 * </hljs>
 *
 * ### Field with complex input
 * <hljs lang="html">
 * <cb-field>
 *  <cb-field-title>
 *    <h2>Field Name</h2>
 *    <p>Short description of the field</p>
 *  </cb-field-title>
 *  <cb-field-input class="cb-field-complex-input">
 *    
 *  </cb-field-input>
 *  <cb-field-actions>
 *    <md-button>Action 1</md-button>
 *    <md-button>Action 2</md-button>
 *  </cb-field-actions>
 * </cb-field>
 * </hljs>
 */
function FieldDirective($mdTheming) {
  return {
    restrict: 'E',
    link: function ($scope, $element, attr) {
      $element.addClass('_cb');     // private md component indicator for styling
      $mdTheming($element);
    }
  };
}

FieldDirective.$inject = ["$mdTheming"];