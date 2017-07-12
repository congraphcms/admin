
import * as CB from './../cb.js';

export default FileRepositoryFactory;

function FileRepositoryFactory(Repository, FileModel, FileCollection){
  
  var fileRepository = new Repository('/files');
  fileRepository.setModel(FileModel);
  fileRepository.setCollection(FileCollection);
  return fileRepository;
}

FileRepositoryFactory.$inject = [
  "Repository", 
  "FileModel", 
  "FileCollection"
];