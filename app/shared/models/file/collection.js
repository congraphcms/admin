
import * as CB from './../cb.js';

export default FileCollectionFactory;

function FileCollectionFactory(FileModel){
  
  var FileCollection = CB.Collection.extend({
  	model: FileModel
  });
  CB.collections.file = FileCollection;
  return FileCollection;
}
  
FileCollectionFactory.$inject = ['FileModel'];