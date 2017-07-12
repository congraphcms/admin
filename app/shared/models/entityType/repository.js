
import * as CB from './../cb.js';

export default EntityTypeRepositoryFactory;

function EntityTypeRepositoryFactory(Repository, EntityTypeModel, EntityTypeCollection){
  
  var EntityTypeRepository = new Repository('/entity-types');
  EntityTypeRepository.setModel(EntityTypeModel);
  EntityTypeRepository.setCollection(EntityTypeCollection);
  return EntityTypeRepository;
}

EntityTypeRepositoryFactory.$inject = [
  "Repository", 
  "EntityTypeModel", 
  "EntityTypeCollection"
];