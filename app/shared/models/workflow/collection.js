
import * as CB from './../cb.js';

export default WorkflowCollectionFactory;

function WorkflowCollectionFactory(WorkflowModel){
  
  var WorkflowCollection = CB.Collection.extend({
  	model: WorkflowModel
  });
  CB.collections.workflow = WorkflowCollection;
  return WorkflowCollection;
}

WorkflowCollectionFactory.$inject = ['WorkflowModel'];