
import * as CB from './../cb.js';

export default EntityTypeModelFactory;

function EntityTypeModelFactory(AttributeSetModel, AttributeSetCollection, WorkflowModel, WorkflowPointModel){
  
  var EntityTypeModel = CB.Model.extend({
    defaults: {
      type: 'entity-type',
      code: '',
      endpoint: '',
      name: '',
      plural_name: '',
      localized: 1,
      localized_workflow: 1,
      workflow_id: null,
      default_point_id: null,
      multiple_sets: 1,
      default_set_id: null,
      attribute_sets: []
    },

    addSet: function(attributeSet) {
      if(!_.isObject(attributeSet) || !(attributeSet instanceof AttributeSetModel) || attributeSet.isNew()) {
        throw new Error("You can only add existing AttributeSetModel instances to entity type.");
      }

      if(attributeSet.get('entity_type_id') != this.id || ! this.id) {
        throw new Error("You can\'t add other entity type attribute sets to this entity type.");
      }
      
      if(!(this.attributes.attribute_sets instanceof AttributeSetCollection)) {
        this.attributes.attribute_sets = new AttributeSetCollection();
      }
      this.attributes.attribute_sets.push(attributeSet);

      return attributeSet;
    },

    removeSet: function(attributeSet) {
      if(!(this.attributes.attribute_sets instanceof AttributeSetCollection)) {
        this.attributes.attribute_sets = new AttributeSetCollection();
        return false;
      }
      return this.attributes.attribute_sets.remove(attributeSet);
    },

    setWorkflow: function(workflow) {
      if(!_.isObject(workflow) || !(workflow instanceof WorkflowModel) || workflow.isNew()) {
        throw new Error("You can only set existing WorkflowModel instance as entity type workflow.");
      }
      this.attributes.workflow = workflow;
      this.attributes.workflow_id = workflow.id;
    },

    setDefaultPoint: function(workflowPoint) {
      if(!_.isObject(workflowPoint) || !(workflowPoint instanceof WorkflowPointModel) || workflowPoint.isNew()) {
        throw new Error("You can only set existing WorkflowPointModel instance as entity type default point.");
      }
      if(workflowPoint.get('workflow_id') != this.get('workflow_id') || ! this.get('workflow_id')) {
        throw new Error("You can\'t set other workflow points as this entity type default point.");
      }
      this.attributes.default_point = workflowPoint;
      this.attributes.default_point_id = workflowPoint.id;
    },

    setDefaultSet: function(attributeSet) {
      if(!_.isObject(attributeSet) || !(attributeSet instanceof AttributeSetModel) || attributeSet.isNew()) {
        throw new Error("You can only set existing AttributeSetModel instance as entity type default set.");
      }
      if(attributeSet.get('entity_type_id') != this.id || ! this.id) {
        throw new Error("You can\'t set other entity type attribute set as this entity type default set.");
      }

      this.attributes.default_set = attributeSet;
      this.attributes.default_set_id = attributeSet.id;
    }
  });

  CB.models['entity-type'] = EntityTypeModel;
  return EntityTypeModel;
}

EntityTypeModelFactory.$inject = [
  'AttributeSetModel', 
  'AttributeSetCollection', 
  'WorkflowModel', 
  'WorkflowPointModel'
];