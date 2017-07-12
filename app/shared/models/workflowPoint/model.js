
import * as CB from './../cb.js';

export default WorkflowPointModelFactory;

function WorkflowPointModelFactory($injector) {
  
  var WorkflowModel;
  var WorkflowPointCollection;

  var WorkflowPointModel = CB.Model.extend({

    defaults: {
      type: 'workflow-point',
      workflow_id: null,
      status: '',
      endpoint: '',
      action: '',
      name: '',
      description: '',
      public: 0,
      deleted: 0,
      sort_order: 0,
      workflow: null,
      steps: []
    },

    addStep: function(workflowPoint) {
      if(!_.isObject(workflowPoint) || !(workflowPoint instanceof WorkflowPointModel) || workflowPoint.isNew()) {
        throw new Error("You can only add existing workflowPoint instances to point steps.");
      }

      if(workflowPoint.get('workflow_id') != this.get('workflow_id') || ! this.get('workflow_id')) {
        throw new Error("You can\'t add other workflow points as this point next steps.");
      }

      if(!WorkflowPointCollection) { WorkflowPointCollection = $injector.get('cbWorkflowPointCollection'); }
      
      if(!(this.attributes.steps instanceof WorkflowPointCollection)) {
        this.attributes.steps = new WorkflowPointCollection();
      }
      this.attributes.steps.push(workflowPoint);

      return workflowPoint;
    },

    removeStep: function(workflowPoint) {
      if(!WorkflowPointCollection) { WorkflowPointCollection = $injector.get('cbWorkflowPointCollection'); }
      if(!(this.attributes.steps instanceof WorkflowPointCollection)) {
        this.attributes.steps = new WorkflowPointCollection();
        return false;
      }
      return this.attributes.steps.remove(workflowPoint);
    },

    setWorkflow: function(workflow) {
      if(!WorkflowModel) { WorkflowModel = $injector.get('WorkflowModel'); }
      if(!_.isObject(workflow) || !(workflow instanceof WorkflowModel) || workflow.isNew()) {
        throw new Error("You can only set existing WorkflowModel instance as point workflow.");
      }
      this.attributes.workflow = workflow;
      this.attributes.workflow_id = workflow.id;
    },
  });

  CB.models['workflow-point'] = WorkflowPointModel;
  return WorkflowPointModel;
}

WorkflowPointModelFactory.$inject = ['$injector'];