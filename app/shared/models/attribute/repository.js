
import * as CB from './../cb.js';

export default AttributeRepositoryFactory;

function AttributeRepositoryFactory(Repository, AttributeModel, AttributeCollection){
  
  var AttributeRepository = new Repository('/attributes');
  AttributeRepository.setModel(AttributeModel);
  AttributeRepository.setCollection(AttributeCollection);
  
  return AttributeRepository;
}

AttributeRepositoryFactory.$inject = [
  "Repository", 
  "AttributeModel", 
  "AttributeCollection"
];