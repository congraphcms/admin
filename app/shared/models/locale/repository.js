
import * as CB from './../cb.js';

export default LocaleRepositoryFactory;

function LocaleRepositoryFactory(Repository, LocaleModel, LocaleCollection){
  
  var LocaleRepository = new Repository('/locales');
  LocaleRepository.setModel(LocaleModel);
  LocaleRepository.setCollection(LocaleCollection);
  return LocaleRepository;
}

LocaleRepositoryFactory.$inject = [
  "Repository", 
  "LocaleModel", 
  "LocaleCollection"
];