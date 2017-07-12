
import * as CB from './../cb.js';

export default RoleRepositoryFactory;

function RoleRepositoryFactory(Repository, RoleModel, RoleCollection){
  
  var RoleRepository = new Repository('/roles');
  RoleRepository.setModel(RoleModel);
  RoleRepository.setCollection(RoleCollection);
  return RoleRepository;
}

RoleRepositoryFactory.$inject = [
  "Repository", 
  "RoleModel", 
  "RoleCollection"
];