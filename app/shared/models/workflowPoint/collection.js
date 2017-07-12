
import * as CB from './../cb.js';

export default WorkflowPointCollectionFactory;

function WorkflowPointCollectionFactory(WorkflowPointModel){
  
  var WorkflowPointCollection = CB.Collection.extend({
  	model: WorkflowPointModel
  });
  CB.collections['workflow-point'] = WorkflowPointCollection;
  return WorkflowPointCollection;
}

WorkflowPointCollectionFactory.$inject = ['WorkflowPointModel'];