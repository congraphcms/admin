
import * as CB from './../cb.js';

export default WorkflowRepositoryFactory;

function WorkflowRepositoryFactory(Repository, WorkflowModel, WorkflowCollection){
  
  var WorkflowRepository = new Repository('/workflows');
  WorkflowRepository.setModel(WorkflowModel);
  WorkflowRepository.setCollection(WorkflowCollection);
  return WorkflowRepository;
}

WorkflowRepositoryFactory.$inject = [
  "Repository", 
  "WorkflowModel", 
  "WorkflowCollection"
];