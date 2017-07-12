
import * as CB from './../cb.js';

export default AttributeSetRepositoryFactory;

function AttributeSetRepositoryFactory(Repository, AttributeSetModel, AttributeSetCollection){
  
  var AttributeSetRepository = new Repository('/attribute-sets');
  AttributeSetRepository.setModel(AttributeSetModel);
  AttributeSetRepository.setCollection(AttributeSetCollection);
  return AttributeSetRepository;
}

AttributeSetRepositoryFactory.$inject = ["Repository", "AttributeSetModel", "AttributeSetCollection"];