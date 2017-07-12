
import * as CB from './../cb.js';

export default EntityRepositoryFactory;

function EntityRepositoryFactory(Repository, EntityModel, EntityCollection){
    
  var EntityRepository = new Repository('/entities');
  EntityRepository.setModel(EntityModel);
  EntityRepository.setCollection(EntityCollection);
  return EntityRepository;
}

EntityRepositoryFactory.$inject = ["Repository", "EntityModel", "EntityCollection"];