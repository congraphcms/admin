
import * as CB from './../cb.js';

export default WorkflowPointRepositoryFactory;

function WorkflowPointRepositoryFactory(Repository, WorkflowPointModel, WorkflowPointCollection){
  
  var workflowPointRepository = new Repository('/workflow-points');
  workflowPointRepository.setModel(WorkflowPointModel);
  workflowPointRepository.setCollection(WorkflowPointCollection);
  return workflowPointRepository;
}

WorkflowPointRepositoryFactory.$inject = [
  "Repository", 
  "WorkflowPointModel", 
  "WorkflowPointCollection"
  ];