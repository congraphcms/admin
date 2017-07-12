
import * as CB from './../cb.js';

export default WorkflowModelFactory;

function WorkflowModelFactory(WorkflowPointModel, WorkflowPointCollection){
  
  var WorkflowModel = CB.Model.extend({
    defaults: {
      type: 'workflow',
      name: '',
      description: '',
      points: []
    },

    addPoint: function(workflowPoint) {
      if(!_.isObject(workflowPoint) || !(workflowPoint instanceof WorkflowPointModel) || workflowPoint.isNew()) {
        throw new Error("You can only add existing WorkflowPointModel instances to workflow.");
      }

      if(workflowPoint.get('workflow_id') != this.id || ! this.id) {
        throw new Error("You can\'t add other workflow points to this workflow.");
      }
      
      if(!(this.attributes.points instanceof WorkflowPointCollection)) {
        this.attributes.points = new WorkflowPointCollection();
      }
      this.attributes.points.push(workflowPoint);

      return workflowPoint;
    },

    removePoint: function(workflowPoint) {
      if(!(this.attributes.points instanceof WorkflowPointCollection)) {
        this.attributes.points = new WorkflowPointCollection();
        return false;
      }
      return this.attributes.points.remove(workflowPoint);
    },

  });

  CB.models.workflow = WorkflowModel;
  return WorkflowModel;
}

WorkflowModelFactory.$inject = ['WorkflowPointModel', 'WorkflowPointCollection'];